export function printSome() {
    const time = new Date();
    const time_exact = time.getFullYear() + "-" +
                      ("0" + (time.getMonth() + 1)).slice(-2) + "-" +
                      ("0" + time.getDate()).slice(-2) + "  " + 
                      ("0" + time.getHours()).slice(-2) + ":" +
                      ("0" + time.getMinutes()).slice(-2) + ":" +
                      ("0" + time.getSeconds()).slice(-2);  
    return ("现在是：" + time_exact)
}