import { stdin } from "node:process";




type Workmonth = {
    name: number,
    month: Map<number,number>,
    accuworktime: number
}

// testdates.text
const readByLine = (path:string) => Deno.readTextFile(path).then((message) => {
    const data = message.split(/[\r\n]+/);
    const month = data[0].match(/-(\d\d)-/) ?? [0,0];
    let lastDate:Date;
    let lastDesc:string;
    let curWorkday:Date;
    let myWorkmonth:Workmonth={
        name: Number(month[1]),
        month: new Map<number,number>(),
        accuworktime: 0
    };
    data.forEach((entry:string) => {
    const matches = entry.match(/(\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d) (.*)/);
        if(matches){
            const [,datetime,description] = matches;
            const curDate = new Date(datetime);
            let onbreak:boolean = false;
            const curDescription = description.trimEnd();
            const curWorkday = curDate.getDate();
            switch(curDescription){
                case "start": {
                    onbreak = false;
                    break;
                }
                case "break": {
                    const worktime = myWorkmonth.month.get(curWorkday) ?? 0;
                    myWorkmonth.month?.set(curWorkday,worktime + (curDate.getTime() - lastDate.getTime()))
                    onbreak = true;
                    break;
                }
                case "end": {   
                    onbreak = false;
                    const worktime = myWorkmonth.month.get(curWorkday) ?? 0;
                    myWorkmonth.month?.set(curWorkday,worktime + (curDate.getTime() - lastDate.getTime()))
                    break;
                }
                default: {
                    if(!onbreak){
                        const worktime = myWorkmonth.month.get(curWorkday) ?? 0;
                        myWorkmonth.month?.set(curWorkday,worktime + (curDate.getTime() - lastDate.getTime()))
                    }{
                        onbreak = false;
                    }
                    break;
                }
            }
            lastDate = curDate;
        }
    });
    myWorkmonth.month.forEach((indWorktime) => {
        myWorkmonth.accuworktime = myWorkmonth.accuworktime + indWorktime;
    });
    myWorkmonth.accuworktime = (myWorkmonth.accuworktime / 1000 / 60 / 60)
    console.log(myWorkmonth);
});


//readByLine("testdates.text");
readByLine("testdates.text");
/*stdin.on('data', function(data) {
    let path = data.toString();
    path = path.replace(/(\r\n|\n|\r)/gm, "");
    readByLine(path)
});*/
