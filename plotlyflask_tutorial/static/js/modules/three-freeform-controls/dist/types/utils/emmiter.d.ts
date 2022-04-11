import NanoEvents from "nanoevents";
import { IHandle } from "../controls/handles";
import { Vector3 } from "three";
export declare const emitter: NanoEvents<{
    DRAG_START: {
        point: Vector3;
        handle: IHandle | null;
        dragRatio?: number | undefined;
    };
    DRAG: {
        point: Vector3;
        handle: IHandle | null;
        dragRatio?: number | undefined;
    };
    DRAG_STOP: {
        point: Vector3;
        handle: IHandle | null;
        dragRatio?: number | undefined;
    };
}>;
export declare const unbindAll: () => void;
