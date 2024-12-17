import { stdin } from "node:process";
type MyDay = {
    year:number;
    month:number;
    day:number;
};
type MyTime = {
    hours:number;
    minutes:number;
    seconds:number;
};

type Workday = {
    day: MyDay;
    workinghours: number;
};

type Workweek = {
    week: Workday[];
    sumWorkinghours: number;
};

// testdates.text
const readByLine = (path:string) => Deno.readTextFile(path).then((message) => {

    const array = message.split(/[\r\n]+/);
    array.forEach(element => {
        if(element.length > 1){
            let currentworkday:Workday = {
                day:
                    {
                        year: Number(element.substring(0,4)),
                        month: Number(element.substring(4,6)),
                        day: Number(element.substring(6,8)),
                    },
                workinghours: 0
            };
            const currenttime:MyTime = {               
                hours: Number(element.substring(8,10)),
                minutes: Number(element.substring(11,13)),
                seconds: Number(element.substring(14,16)),
            };
            
        };
    });

});

readByLine("/media/vincent/1817-19D5/Work/log/2024_12_16log.text");
stdin.on('data', function(data) {
    let path = data.toString();
    path = path.replace(/(\r\n|\n|\r)/gm, "");
    readByLine(path)
});