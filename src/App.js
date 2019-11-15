import React, {Component} from 'react';
import Api from './Api';
import './App.css';
import {Button, Icon, Modal, Upload} from 'antd';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resizedImage: null,
            from: null,
            test: null,
            buttonAddressLoading: false,

            previewVisible: false,
            previewImage: '',
            fileList: [],
        };

        this.fileSelectedHandler = this.fileSelectedHandler.bind(this);
        this.sendTransactionHandler = this.sendTransactionHandler.bind(this);
        this.selectAddressHandler = this.selectAddressHandler.bind(this);
    }

    handleCancel = () => this.setState({previewVisible: false});

    getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await this.getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    fileSelectedHandler = ({fileList}) => {
        this.setState({fileList});
    };

    selectAddressHandler = () => {
        this.setState({buttonAddressLoading: true}, () => {
            new Api().iconexAskAddress().then((address) => {
                //Get address from callback
                this.setState({
                    from: address
                }, () => {
                    this.setState({
                        buttonAddressLoading: false
                    })
                });
            });
        });

    };

    sendTransactionHandler = () => {
        let api = new Api();
        api.__sendTransaction(this.state.from, 'cx0000000000000000000000000000000000000000', 0, /*this.state.fileList[0].thumbUrl*/'test');
    };

    enterButtonLoading = () => {
        this.setState({
            buttonLoading: true
        })
    };


    render() {
        const {previewVisible, previewImage, fileList} = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        return (
            <div className="App">
                <header className="App-header">
                    {!this.state.from &&
                    <Button
                        type="primary"
                        loading={this.state.buttonAddressLoading}
                        onClick={this.selectAddressHandler}
                    >
                        Select address
                    </Button>
                    }
                    {this.state.from}
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={this.handlePreview}
                        onChange={this.fileSelectedHandler}
                    >
                        {fileList.length >= 1 ? null : uploadButton}
                    </Upload>
                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                        <img alt="example" style={{width: '100%'}} src={previewImage}/>
                    </Modal>
                    <Button disabled={!(this.state.from && this.state.fileList[0])} onClick={this.sendTransactionHandler}>Upload image</Button>
                </header>
            </div>
        );
    }
}

export default App;
