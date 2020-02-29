# 基于Ant-design的可以拖拽的Modal

![](https://user-gold-cdn.xitu.io/2020/2/29/170918afeeb6ad77?w=420&h=216&f=gif&s=4842299)

特性：

- 支持弹出窗居中打开
- 支持拖拽 title bar 实现拖拽
- 支持多层弹窗拖拽

用法:

```js
import React, { Component } from 'react';
import { Button } from 'antd';
import AntdDraggableModal from 'antd-draggable-modal';

class Index extends Component {
  state = {
    visible: false,
    visible2: false,
  }

  handleVisible = visible => {
    this.setState({
      visible,
    });
  }

  handleOk = () => {
    this.handleVisible(false);
  }

  handleCancel = () => {
    this.handleVisible(false);
  }

  render() {
    return (
      <>
        <Button onClick={() => this.handleVisible(true)}>打开弹窗</Button>

        {this.state.visible && (
          <AntdDraggableModal
            title="Basic Modal"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <Button onClick={() => this.setState({ visible2: true })}>打开弹窗2</Button>
          </AntdDraggableModal>
        )}
        
        {this.state.visible2 && (
          <AntdDraggableModal
            title="Basic Modal2"
            visible={this.state.visible2}
            onOk={() => this.setState({ visible2: false })}
            onCancel={() => this.setState({ visible2: false })}
          >
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </AntdDraggableModal>
        )}
      </>
    );
  }
}

export default Index;

```