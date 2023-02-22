interface gameInputEvent{
    activate: boolean;
    target: EventTarget | null;
    button: number;
    x: number;
    y: number;
}
export default gameInputEvent;