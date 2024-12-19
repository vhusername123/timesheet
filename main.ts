
type Worksheet = {
    name: string,
    date: Map<number,number>,
    accuworktime: number
}
function getDayOfYear(date:Date) {
    const startOfYear = new Date(date.getFullYear(), 0, 1); 
    const diffInMs:number = date.getTime() - startOfYear.getTime();
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24)) + 1;
}
function getDateFromDay(year:number, dayOfYear:number) {
    const startOfYear = new Date(year, 0, 1);
    startOfYear.setDate(startOfYear.getDate() + dayOfYear - 1);
    return startOfYear;
}



// testdates.text
const getWorksheet = (path:string) => Deno.readTextFile(path).then((message) => {
    const data = message.split(/[\r\n]+/);
    let lastDate:Date;
    let onbreak:boolean = true;
    const curWorksheet:Worksheet={
        name: path,
        date: new Map<number,number>(),
        accuworktime: 0
    };
    data.forEach((entry:string) => {
        const matches = entry.match(/(\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d) (.*)/);
        if(matches){
            const [,datetime,description] = matches;
            const curDate = new Date(datetime);
            const curDescription = description.trimEnd();
            const curWorkday:number = getDayOfYear(curDate);
            switch(curDescription){
                case "break": {
                    const worktime = curWorksheet.date.get(curWorkday) ?? 0;
                    curWorksheet.date.set(curWorkday,calcpasstime(worktime, curDate))
                    onbreak = true;
                    break;
                }
                case "end": {   
                    onbreak = true;
                    const worktime = curWorksheet.date.get(curWorkday) ?? 0;
                    curWorksheet.date.set(curWorkday,calcpasstime(worktime, curDate))
                    break;
                }
                default: {
                    if(!onbreak){
                        const worktime = curWorksheet.date.get(curWorkday) ?? 0;
                        curWorksheet.date.set(curWorkday,calcpasstime(worktime, curDate))
                    }{
                        onbreak = false;
                    }
                    break;
                }
            }
            lastDate = curDate;
        }
        function calcpasstime(worktime: number, curDate: Date): number {
          return worktime + ((curDate.getTime() - lastDate.getTime()) / 1000);
        }

    });
    curWorksheet.date.forEach((indWorktime) => {
        curWorksheet.accuworktime = curWorksheet.accuworktime + indWorktime;
    });
    curWorksheet.accuworktime = ((curWorksheet.accuworktime / 60) / 60)
    return curWorksheet;
});



const dir = Deno.cwd().replaceAll('\\','/') + '/';

console.log(dir)
for await (const directory of Deno.readDir(dir)) { 
    if (!directory.isFile){
        continue
    };
    if (!(directory.name.split(".")[1] == "text")){
        continue
    };
    const fullpath = dir + directory.name;
    
    getWorksheet(fullpath).then((message) => {
        console.log(message);
    });
};