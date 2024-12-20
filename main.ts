
type Entry = {
    
    begin: Date,
    end: Date,
    duration: number,
    accumulated: number,
    reference?: string,
    description: string

};
function makeEntry(begin:Date,end:Date,duration:number,accumulated:number,description:string,reference?:string):Entry{
    return {
        begin: begin,
        end: end,
        duration: duration,
        accumulated: accumulated,
        reference: reference,
        description: description
    }
}
// testdates.text
const getWorksheet = (path:string) => Deno.readTextFile(path).then((message) => {
    const fileData:Entry[] = [];
    const data = message.split(/[\r\n]+/);
    let lastDate:Date;
    let lastDesc:string;
    let onbreak:boolean = true;
    let accuworkTime:number = 0;
    data.forEach((entry:string) => {
        const matches = entry.match(/(\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d) (.*)/);
        if(matches){
            const [,datetime,description] = matches;
            const curDate = new Date(datetime);
            const curDescription = description.trimEnd();
            if ((curDescription == "break") || (curDescription == "end")){
                accuworkTime += calcpasstime(lastDate,curDate);
                fileData.push(makeEntry(lastDate,curDate,calcpasstime(lastDate,curDate),Number(accuworkTime.toFixed(2)),lastDesc))
                onbreak = true;
            }else{
                if(!onbreak){
                    accuworkTime += calcpasstime(lastDate,curDate);
                    fileData.push(makeEntry(lastDate,curDate,calcpasstime(lastDate,curDate),Number(accuworkTime.toFixed(2)),lastDesc))
                }else{
                    onbreak = false;
                }
            }
            lastDesc = curDescription;
            lastDate = curDate;
        }

    });
    return fileData;
});


let dir = Deno.cwd().replaceAll('\\','/') + '/';
//dir = "F:/Work/log"


if (!dir.endsWith("/")) {
    dir += "/";
}

for await (const directory of Deno.readDir(dir)) { 
    if (!directory.isFile){
        continue
    };
    if (!(directory.name.split(".")[1] == "text")){
        continue
    };
    const fullpath = dir + directory.name;
    const csvFullpath = fullpath.replace(".text",".csv");
    getWorksheet(fullpath).then((message) => {
        Deno.writeTextFile(csvFullpath, convertEntriesToCSV(message));
    });
};




function calcpasstime(lastDate: Date, curDate: Date): number {
    return roundUP((curDate.getTime() - lastDate.getTime()) / 1000 / 60 / 60,2);
}


function roundUP(number: number, precision: number): number {
	const power = Math.pow(10, precision);

  	return Math.ceil(number * power) / power;
}


function convertEntriesToCSV(entries: Entry[]): string {
    const headers = ["begin", "end", "duration", "accumulated", "reference", "description"];
    const rows = entries.map(entry => [
        entry.begin.toISOString(),
        entry.end.toISOString(),
        entry.duration.toString(),
        entry.accumulated.toString(),
        entry.reference || "",
        entry.description.toString().replace(/"/g, '""') 
    ]);
    const csvContent = [headers.join(","), ...rows.map(row => row.map(cell => `"${cell}"`).join(","))].join("\n");

    return csvContent;
}