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
type Entry = {
    time: MyTime;
    data: string;
}

type Workday = {
    day: MyDay;
    workinghours?: number;
    entries: Entry[];
};

type Workweek = {
    week: Workday[];
    sumWorkinghours: number;
};

// testdates.text
const readByLine = (path:string) => Deno.readTextFile(path).then((message) => {
    const data = message.match(/[\r\n]+/);
    console.log(data)

});


//readByLine("testdates.text");
readByLine("testdates.text");
/*stdin.on('data', function(data) {
    let path = data.toString();
    path = path.replace(/(\r\n|\n|\r)/gm, "");
    readByLine(path)
});*/

/*
            year: Number(element.substring(0,4)),
            month: Number(element.substring(4,6)),
t            day: Number(element.substring(6,8)),
            hours: Number(element.substring(8,10)),
            minutes: Number(element.substring(11,13)),
             seconds: Number(element.substring(14,16)),

             */