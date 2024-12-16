import { stdin } from "node:process";

// /media/vincent/1817-19D5/Work/log/2024_12_16log.text
const readByLine = (path:string) => Deno.readTextFile(path).then((message) => {

    const array = message.split(/[\r\n]+/);
    array.forEach(element => {
        if(element.length > 1){
            const temp:Date = new Date(
                Number(element.substring(0,4)),
                Number(element.substring(4,6)),
                Number(element.substring(6,8)),
                Number(element.substring(8,10)),
                Number(element.substring(11,13)),
                Number(element.substring(14,16)),
            );
            console.log(temp);
        };
    });

});

readByLine("/media/vincent/1817-19D5/Work/log/2024_12_16log.text");
stdin.on('data', function(data) {
    let path = data.toString();
    path = path.replace(/(\r\n|\n|\r)/gm, "");
    readByLine(path)
});