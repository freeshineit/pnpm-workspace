import { chunk } from 'lodash-es'

function start (){
    console.log("pkg2")
    console.log(chunk(['a', 'b', 'c', 'd'], 2))
}


export default start