import React, { Component, MouseEvent } from 'react';
import AntdModal, { ModalProps } from 'antd/lib/modal';
import 'antd/es/modal/style/index.css';

export default class AntDraggableModal extends Component<ModalProps> {
  private simpleClass: string;
  private header: any;
  private contain: any;
  private modalContent: any;
  private antdModal: any;

  private mouseDownX: number = 0;
  private mouseDownY: number = 0;
  private deltaX: number = 0;
  private deltaY: number = 0;
  private sumX: number = 0;
  private sumY: number = 0;

  constructor(props: ModalProps) {
    super(props);
    this.simpleClass = Math.random()
      .toString(36)
      .substring(2);
  }

  handleMove = (event: any) => {
    if (!this.modalContent) return;
    const deltaX = event.pageX - this.mouseDownX;
    const deltaY = event.pageY - this.mouseDownY;
    
    // 计算新的位置
    let newX = this.sumX + deltaX;
    let newY = this.sumY + deltaY;
    
    // 获取模态框的宽度和高度
    const modalWidth = this.modalContent.offsetWidth;
    const modalHeight = this.modalContent.offsetHeight;
    
    // 获取浏览器可视区域的宽度和高度
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // 限制模态框在可视区域内
    newX = Math.max(-((viewportWidth - modalWidth)/2), Math.min(newX, (viewportWidth - modalWidth)/2));
    newY = Math.max(-((viewportHeight - modalHeight)/2), Math.min(newY, (viewportHeight - modalHeight)/2));

    // 更新位置
    this.modalContent.style.transform = `translate(${newX}px, ${newY}px)`;
  };


  initialEvent = (visible: boolean) => {
    const { title } = this.props;
    if (title && visible) {
      setTimeout(() => {
        window.removeEventListener('mouseup', this.removeUp, false);

        this.contain = document.getElementsByClassName(this.simpleClass)[0];
        this.header = this.contain.getElementsByClassName('ant-modal-header')[0];
        this.modalContent = this.contain.getElementsByClassName('ant-modal-content')[0];
        this.antdModal = document.getElementsByClassName('ant-modal')[0];

        // 获取模态框的宽度和高度
        const modalHeight = this.modalContent.offsetHeight;
        
        // 获取浏览器可视区域的宽度和高度
        const viewportHeight = window.innerHeight;
        // this.antdModal.style.top = '0px';
        this.antdModal.style.top = (viewportHeight - modalHeight)/2+'px';
        this.antdModal.style.padding = '0px';

        this.header.style.cursor = 'all-scroll';
        this.header.onmousedown = (e: MouseEvent<HTMLDivElement>) => {
          this.mouseDownX = e.pageX;
          this.mouseDownY = e.pageY;
          document.body.onselectstart = () => false;
          window.addEventListener('mousemove', this.handleMove, false);
        };

        window.addEventListener('mouseup', this.removeUp, false);
      }, 0);
    }
  };

  removeMove = () => {
    window.removeEventListener('mousemove', this.handleMove, false);
  };

  removeUp = () => {
    document.body.onselectstart = () => true;

    this.sumX = this.sumX + this.deltaX;
    this.sumY = this.sumY + this.deltaY;

    this.removeMove();
  };

  componentDidMount() {
    const { visible = false } = this.props;
    this.initialEvent(visible);
  }

  componentWillUnmount() {
    this.removeMove();
    window.removeEventListener('mouseup', this.removeUp, false);
  }

  render() {
    const { children, wrapClassName, ...other } = this.props;
    const wrapModalClassName = wrapClassName ? `${wrapClassName} ${this.simpleClass}` : `${this.simpleClass}`;
    return (
      <AntdModal
        {...other}
        wrapClassName={wrapModalClassName}
      >{children}</AntdModal>
    );
  }
}
