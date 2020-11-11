import ClickEvent = JQuery.ClickEvent;
import $ from 'jquery'
import {getProps, SVG_TAG} from "../config";
import {svgInfo} from "../index";
import ContextMenuEvent = JQuery.ContextMenuEvent;
import {createPropsAndValue} from "../utils/utils";

class DomTree {
    /**
     * 上一个选择的标签
     * @private prev
     */
    private prev: any;
    /**
     * 判断DOM区域是否选择dom
     */
    private selectDomFlag: boolean = false
    /**
     * 当前选择的标签
     * @private selectDom
     */
    private selectDom: any = null;

    constructor(private domView: any) {
        this.domView = domView
        this.bindIconClick()
        this.bindshowWrapClick()
        this.bindDomViewClick()
        this.bindDomViewContextmenu()
    }

    setPrev(prev: any): void {
        this.prev = prev
    }

    getPrev(): any {
        return this.prev
    }

    setSelectDom(selectDom: any): void {
        this.selectDom = selectDom
    }

    getSelectDom(): any {
        return this.selectDom
    }


    setSelectDomFlag(selectDomFlag: boolean): void {
        this.selectDomFlag = selectDomFlag
    }

    getSelectDomFlag(): boolean {
        return this.selectDomFlag
    }

    bindDomViewClick() {
        this.domView.on('click', this.domViewClickHandler)
    }

    bindDomViewContextmenu() {
        this.domView.on('contextmenu', '.show-wrapper', this.domViewContextmenuHandler)
    }

    bindIconClick() {
        this.domView.on('click', '.icon', this.iconClickHandler)
    }

    bindshowWrapClick() {
        this.domView.on('click', '.show-wrapper', this.showWrapClickHandler)
    }

    domViewContextmenuHandler = (event: ContextMenuEvent) => {
        event.preventDefault();
        event.stopPropagation();
        if (!this.selectDomFlag) return
        this.setSelectDom($(event.currentTarget))
        let _x = event.clientX,
            _y = event.clientY;
        let oMenu = $("#menu")
        oMenu.css({
            display: "block",
            left: _x + "px",
            top: _y + "px"
        })
        console.log('comtextmenu')
    }

    domViewClickHandler = (event: ClickEvent) => {
        if (this.getPrev() != null) {
            this.getPrev().removeClass("select-dom")
            this.setPrev(null)
        }
        let oMenu = $("#menu")
        let menuChild = $("#child-menu")
        if (oMenu.css("display") == "block") {
            oMenu.css({
                display: "none"
            })
        }
        menuChild.css({
            display: "none"
        })
        $("#rect-tip").css("display", "none");
        this.setSelectDom(null)
    }
    iconClickHandler = (event: ClickEvent) => {
        event.stopPropagation();
        let $target = $(event.target)
        $target.parent().toggleClass("show-active")
        if ($target.hasClass("icon-xiajiantou")) {
            $target.removeClass("icon-xiajiantou")
            $target.addClass("icon-sanjiaoright")
        } else {
            $target.removeClass("icon-sanjiaoright")
            $target.addClass("icon-xiajiantou")
        }
    }
    showWrapClickHandler = (event: ClickEvent) => {
        let target = $(event.currentTarget)
        event.stopImmediatePropagation()
        if (this.prev != null) {
            this.prev.toggleClass("select-dom")
        }
        target.toggleClass("select-dom")

        let uid: string = target.attr("data-uid") as string


        $("#add-btn").attr("data-uid", uid)
        $("#add-btn").addClass("text-node")
        let selMark = $("#" + uid)
        if (selMark[0]) {
            let propsArr = selMark.get(0).getAttributeNames()
            let tag: string = selMark.get(0).tagName
            let tagArr: string[] = [];
            if (target.hasClass("text-node")) {
                tagArr = ["content"]

            } else {
                tagArr = Array.from(new Set(getProps(tag as SVG_TAG).concat(propsArr)))
            }
            //固定属性加特有属性

            let attrHtml = ''
            tagArr.forEach((item: string) => {
                if (item.trim() !== '') {
                    let value = selMark.attr(item) != null ? selMark.attr(item) : ""
                    value = value == undefined ? "" : value
                    value = item == "content" ? target.text() : value
                    let placeholder = selMark.attr(item) ? "请输入内容" : "未指定"
                    let inputId = uid + "_" + item
                    attrHtml += createPropsAndValue(item, value, uid, inputId, placeholder)
                }

            })
            $("#attr-wrap").html(attrHtml)
            let currentRect = selMark[0].getBoundingClientRect()
            let percentRect = $("#graph-svg")[0].getBoundingClientRect()
            let x: number = 0
            let y: number = 0
            let setX: number = 0
            let setY: number = 0
            let scale = Math.ceil(((svgInfo.getScale() - 1) * 100000)) / 100000
            let offsetX = currentRect.x - percentRect.x
            let offsetY = currentRect.y - percentRect.y
            //放大
            if (scale > 0) {
                x = scale * (currentRect.width / (1 + scale))
                y = scale * (currentRect.height / (1 + scale))
                setX = scale * (offsetX / (1 + scale))
                setY = scale * (offsetY / (1 + scale))
            } else {
                //缩小
                x = scale * (currentRect.width / (1 - Math.abs(scale)))
                y = scale * (currentRect.height / (1 - Math.abs(scale)))
                setX = scale * (offsetX / (1 - Math.abs(scale)))
                setY = scale * (offsetY / (1 - Math.abs(scale)))
            }
            let width = currentRect.width
            let height = currentRect.height

            $("#rect-tip").attr({
                x: offsetX - setX,
                y: offsetY - setY,
                width: width - x,
                height: height - y
            })
            $("#rect-tip").css("display", "block");
        }

        this.prev = target
        if (this.prev != null && this.prev.hasClass("select-dom")) {
            this.selectDomFlag = true
        } else {
            this.selectDomFlag = false
        }
        let oMenu = $("#menu")
        if (oMenu.css("display") == "block") {
            oMenu.css({
                display: "none"
            })
        }
    }

}

export default DomTree;