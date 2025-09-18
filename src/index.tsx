import React, { Component } from 'react';
import AntdModal, { ModalProps } from 'antd/lib/modal';
import 'antd/es/modal/style/index.css';

export default class AntDraggableModal extends Component<ModalProps> {
  private simpleClass: string;
  private header: HTMLElement | null = null;
  private modalContent: HTMLElement | null = null;

  private mouseDownX: number = 0;
  private mouseDownY: number = 0;
  private startX: number = 0;
  private startY: number = 0;
  private currentX: number = 0;
  private currentY: number = 0;
  private isDragging: boolean = false;

  constructor(props: ModalProps) {
    super(props);
    this.simpleClass = `draggable-modal-${Math.random()
      .toString(36)
      .substring(2)}`;
  }

  handleMove = (event: MouseEvent) => {
    if (!this.modalContent || !this.isDragging) return;
    
    event.preventDefault(); // 防止默认行为
    
    const deltaX = event.pageX - this.mouseDownX;
    const deltaY = event.pageY - this.mouseDownY;

    // 计算新的位置
    let newX = this.startX + deltaX;
    let newY = this.startY + deltaY;

    // 严格限制在视窗范围内
    const constrained = this.strictConstrainToViewport(newX, newY);
    
    // 更新位置
    this.modalContent.style.transform = `translate(${constrained.x}px, ${constrained.y}px)`;
    this.currentX = constrained.x;
    this.currentY = constrained.y;
  };

  // 严格的视窗范围限制
  strictConstrainToViewport = (newX: number, newY: number) => {
    if (!this.modalContent) return { x: newX, y: newY };

    const modalRect = this.modalContent.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // 计算模态框的原始位置（无偏移时的位置）
    const originalLeft = modalRect.left - this.currentX;
    const originalRight = modalRect.right - this.currentX;
    const originalTop = modalRect.top - this.currentY;
    const originalBottom = modalRect.bottom - this.currentY;

    // 计算应用新偏移后的位置
    const newLeft = originalLeft + newX;
    const newRight = originalRight + newX;
    const newTop = originalTop + newY;
    const newBottom = originalBottom + newY;

    // 严格限制在视窗内
    let constrainedX = newX;
    let constrainedY = newY;

    // X轴限制：确保整个模态框都在视窗内
    if (newLeft < 0) {
      constrainedX = -originalLeft; // 左边对齐视窗左边
    } else if (newRight > viewportWidth) {
      constrainedX = viewportWidth - originalRight; // 右边对齐视窗右边
    }

    // Y轴限制：确保整个模态框都在视窗内
    if (newTop < 0) {
      constrainedY = -originalTop; // 顶部对齐视窗顶部
    } else if (newBottom > viewportHeight) {
      constrainedY = viewportHeight - originalBottom; // 底部对齐视窗底部
    }

    return { x: constrainedX, y: constrainedY };
  };

  // 简化的边界检测（更稳定）
  simpleConstrainToViewport = (newX: number, newY: number) => {
    if (!this.modalContent) return { x: newX, y: newY };

    const modalRect = this.modalContent.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // 模态框的原始尺寸（无偏移时）
    const modalWidth = modalRect.width;
    const modalHeight = modalRect.height;

    // 计算最大允许的偏移量
    const maxX = viewportWidth - modalWidth;
    const maxY = viewportHeight - modalHeight;

    // 限制偏移范围（确保模态框完全在视窗内）
    const constrainedX = Math.max(0, Math.min(newX, maxX));
    const constrainedY = Math.max(0, Math.min(newY, maxY));

    return { x: constrainedX, y: constrainedY };
  };

  // 基于中心点的限制（更自然）
  centerBasedConstrain = (newX: number, newY: number) => {
    if (!this.modalContent) return { x: newX, y: newY };

    const modalRect = this.modalContent.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // 模态框中心点位置
    const modalCenterX = modalRect.left + modalRect.width / 2;
    const modalCenterY = modalRect.top + modalRect.height / 2;

    // 计算中心点的最大移动范围
    const minCenterX = modalRect.width / 2;
    const maxCenterX = viewportWidth - modalRect.width / 2;
    const minCenterY = modalRect.height / 2;
    const maxCenterY = viewportHeight - modalRect.height / 2;

    // 计算新的中心点位置
    const newCenterX = modalCenterX + newX - this.currentX;
    const newCenterY = modalCenterY + newY - this.currentY;

    // 限制中心点位置
    const constrainedCenterX = Math.max(minCenterX, Math.min(newCenterX, maxCenterX));
    const constrainedCenterY = Math.max(minCenterY, Math.min(newCenterY, maxCenterY));

    // 计算对应的偏移量
    const constrainedX = this.currentX + (constrainedCenterX - modalCenterX);
    const constrainedY = this.currentY + (constrainedCenterY - modalCenterY);

    return { x: constrainedX, y: constrainedY };
  };

  handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // 只允许左键拖动
    if (e.button !== 0) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    this.mouseDownX = e.clientX; // 使用 clientX 而不是 pageX
    this.mouseDownY = e.clientY;
    this.startX = this.currentX;
    this.startY = this.currentY;
    this.isDragging = true;
    
    document.addEventListener('mousemove', this.handleMove, true); // 使用捕获阶段
    document.addEventListener('mouseup', this.handleMouseUp, true);
    
    // 防止文本选择
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';
  };

  handleMouseUp = (e: MouseEvent) => {
    // 只处理左键释放
    if (e.button !== 0) return;
    
    this.isDragging = false;
    document.removeEventListener('mousemove', this.handleMove, true);
    document.removeEventListener('mouseup', this.handleMouseUp, true);
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  };

  initializeDrag = () => {
    const { title, visible } = this.props;
    
    if (!visible || !title) return;

    setTimeout(() => {
      const modalWrap = document.querySelector(`.${this.simpleClass}`) as HTMLElement;
      if (!modalWrap) return;

      this.modalContent = modalWrap.querySelector('.ant-modal-content') as HTMLElement;
      this.header = modalWrap.querySelector('.ant-modal-header') as HTMLElement;

      if (!this.modalContent || !this.header) return;

      // 重置位置
      this.modalContent.style.transform = 'translate(0px, 0px)';
      this.currentX = 0;
      this.currentY = 0;

      // 移除旧事件，添加新事件
      this.header.onmousedown = null;
      this.header.addEventListener('mousedown', this.handleMouseDown as any);
      this.header.style.cursor = 'grab';
    }, 50);
  };

  componentDidMount() {
    this.initializeDrag();
  }

  componentDidUpdate(prevProps: ModalProps) {
    if (prevProps.visible !== this.props.visible) {
      this.initializeDrag();
    }
  }

  componentWillUnmount() {
    if (this.header) {
      this.header.removeEventListener('mousedown', this.handleMouseDown as any);
    }
    document.removeEventListener('mousemove', this.handleMove, true);
    document.removeEventListener('mouseup', this.handleMouseUp, true);
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  }

  render() {
    const { children, wrapClassName, ...other } = this.props;
    const wrapModalClassName = wrapClassName
      ? `${wrapClassName} ${this.simpleClass}`
      : `${this.simpleClass}`;
    
    return (
      <AntdModal 
        {...other} 
        wrapClassName={wrapModalClassName}
        style={{ ...other.style, top: 0 }} // 重置top位置
      >
        {children}
      </AntdModal>
    );
  }
}
