import { dir, dir } from "node:console";
import { stdin } from "node:process";




type Worksheet = {
    name: string,
    month: Map<number,number>,
    desc: Map<Date,string>,
    accuworktime: number
}

// testdates.text
const getWorksheet = (path:string) => Deno.readTextFile(path).then((message) => {
    const data = message.split(/[\r\n]+/);
    let lastDate:Date;
    let onbreak:boolean = true;
    const curWorksheet:Worksheet={
        name: path,
        month: new Map<number,number>(),
        desc: new Map<Date,string>(),
        accuworktime: 0
    };
    data.forEach((entry:string) => {
        const matches = entry.match(/(\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d) (.*)/);
        if(matches){
            const [,datetime,description] = matches;
            const curDate = new Date(datetime);
            const curDescription = description.trimEnd();
            const curWorkday = curDate.getDate();
            switch(curDescription){
                case "break": {
                    const worktime = curWorksheet.month.get(curWorkday) ?? 0;
                    curWorksheet.month.set(curWorkday,calcpasstime(worktime, curDate))
                    onbreak = true;
                    break;
                }
                case "end": {   
                    onbreak = true;
                    const worktime = curWorksheet.month.get(curWorkday) ?? 0;
                    curWorksheet.month.set(curWorkday,calcpasstime(worktime, curDate))
                    break;
                }
                default: {
                    if(!onbreak){
                        const worktime = curWorksheet.month.get(curWorkday) ?? 0;
                        curWorksheet.month.set(curWorkday,calcpasstime(worktime, curDate))
                    }{
                        onbreak = false;
                    }
                    break;
                }
            }
            curWorksheet.desc.set(curDate,curDescription);
            lastDate = curDate;
        }
        function calcpasstime(worktime: number, curDate: Date): number {
          return worktime + ((curDate.getTime() - lastDate.getTime()) / 1000);
        }

    });
    curWorksheet.month.forEach((indWorktime) => {
        curWorksheet.accuworktime = curWorksheet.accuworktime + indWorktime;
    });
    curWorksheet.accuworktime = ((curWorksheet.accuworktime / 60) / 60)
    return curWorksheet;
});



const dir = Deno.cwd().replaceAll('\\','/') + '/';
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