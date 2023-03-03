type gameInputEvent = {
    mouse:true,
    activate:boolean
    target:EventTarget | null,
    button:number,
    x:number,
    y:number
} | {
    mouse:false,
    activate:boolean,
    target:EventTarget | null,
    touchesNumber:number,
    x:number,
    y:number
}
export default gameInputEvent;