let fixedProps: string[] = ["id", "class", "style", "transform", "stroke", "stroke-width", "fill"]

interface IPropsStrate {
    [key: string]: string[]

    // textProps: string[]
    // pathProps: string[]
    // lineProps: string[]
    // rectProps: string[]
    // circleProps: string[]
    // ellipseProps: string[]
    // polylineProps: string[]
    // polygonProps: string[]
    // gProps: string[]
}

let propsStrate: IPropsStrate = {
    svg: ["x", "y", "width", "height", "viewBox"],
    text: ["x", "y", "width", "height", "font-family", "font-size"],
    path: ["d"],
    line: ["x1", "y1", "x2", "y2"],
    rect: ["x", "y", "width", "height", "rx", "ry"],
    circle: ["cx", "cy", "r"],
    ellipse: ["cx", "cy", "rx", "ry"],
    polyline: ["points"],
    polygon: ["points"],
    g: ["x", "y", "width", "height", "viewBox"]
}

export type SVG_TAG = "svg" | "text" | "path" | "line" | "rect" | "circle" | "ellipse" | "polyline" | "polygon" | "g"
export const toCheckProps: string[] = ["stroke-width","x","y","height","cx","cy","rx","ry","width","x1","x2","y2","y1","font-size"]

export function getProps(tag: SVG_TAG): string[] {
    return fixedProps.concat(propsStrate[tag])
}

export function debounce(fn: new () => void, time: number) {
    let timer: number | null = null
    return function () {
        timer && clearTimeout(timer)
        timer = setTimeout(() => {
            // @ts-ignore
            fn.apply(this, arguments)
        }, time)
    }
}

export function checkInter(str: string, val: string):boolean {
    if (toCheckProps.indexOf(str)!==-1){
        let reg = /[A-Za-z_.]/g
        return !reg.test(val)
    }
    return true
}

// async getIdDetails(id){
//     let ret = await this.$api.get(this.$apiList.materialId,{
//         put:{
//             id
//         },
//         param:{
//             type:1
//         }
//
//     })
//     this.dialogData = ret.data
// }