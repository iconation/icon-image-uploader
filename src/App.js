import React, {Component} from 'react';
import Resizer from 'react-image-file-resizer';
import Api from './Api';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null,
            from: null,
            test: null
        };

        this.fileSelectedHandler = this.fileSelectedHandler.bind(this);
        this.fileUploadHandler = this.fileUploadHandler.bind(this);
    }


    fileSelectedHandler = event => {
        this.setState({
            selectedFile: event.target.files[0]
        })
    };

    fileUploadHandler = () => {
        //Upload image to ICON blockchain
        let api = new Api();
        Resizer.imageFileResizer(
            this.state.selectedFile,
            1000,
            1000,
            'JPEG',
            70,
            0,
            (image) => {
                api.iconexAskAddress().then((address) => {
                    //Get address from callback
                    this.setState({from: address}, ()=>{
                        api.__sendTransaction(this.state.from, 'hx0000000000000000000000000000000000000000', 0, image)
                    });
                });
            },
            'base64'
        );

    };

    render() {
        console.log(this.state.from);
        return (
            <div className="App">
                <header className="App-header">
                    <input type="file" onChange={this.fileSelectedHandler}/>
                    <button value='Upload' onClick={this.fileUploadHandler}>Upload</button>
                </header>
            </div>
        );
    }
}

export default App;
