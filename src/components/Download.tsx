import socket from 'socket.io-client'; 
import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface State {
    vidUrl?: string,
    formats?: Array<Formats>
    progress?: number,
    active?: string
}

interface Formats{
    formatId?: string,  
    format: string,
    filesize?: string
}
interface Props{
    handleFormats?: (event: React.MouseEvent<HTMLButtonElement> ) => void
    formats?: Array<Formats>,
    vidUrl?: string
    progress?: number,
    active?: string
}


export class VideoDownload extends React.Component<Props,State> {
    constructor(props:any) {
        super(props);
        this.handleFormats = this.handleFormats.bind(this)
        this.handleVidUrlChange = this.handleVidUrlChange.bind(this);
        this.formSubmit = this.formSubmit.bind(this);
        this.state = {
            vidUrl: 'https://www.youtube.com/watch?v=OMOGaugKpzs',
            formats: [{ format: 'Select Get Availabe Formats' }]
        };
    }
    handleVidUrlChange() {
        this.setState(() => {
            return {
                vidUrl: this.state.vidUrl
            }
        });
    }
    handleFormats(e:any) {
        e.preventDefault();
        fetch('/video/formats', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ vidUrl: this.state.vidUrl })
        }).then((res) => res.json())
            .then((json) => {
                console.log(json);
                this.setState(() => {
                    return {
                        formats: json
                    }
                });
            }, (err) => {
                console.log(err);
            });
    }


    formSubmit(e) {
        e.preventDefault();
        let io = socket.connect("localhost:3000");
            io.emit('video-download', JSON.stringify({
                vidUrl: this.state.vidUrl,
                formatCode: e.target.vidFormat.value
            }));
            io.on('video-progress', (msg) => {
             
                    this.setState(() => {
                        return {
                            progress: msg,
                            active: 'active'
                        }
                    })
                
            });
            io.on('video-done', () => {
                this.setState(()=>{
                    return {
                        progress: 100,
                        active: 'success'
                    }
                })
            });
       

    }
    render() {
        return (
            <div>
                <h1>Download Video By URL</h1>
                <form onSubmit={this.formSubmit} className="ui form">
                    <div className="field">
                        <label htmlFor="vidUrl">Video URL:</label>
                        <input type="text" name="vidUrl" id="vidUrl" defaultValue={this.state.vidUrl} onChange={this.handleVidUrlChange} />
                    </div>
                    <VideoFormats vidUrl={this.state.vidUrl} handleFormats={this.handleFormats} formats={this.state.formats} />
                    <p>
                    <input type="submit" value="Submit" id="submit" className="ui button" />
                    </p>
                </form>
                <ProgressBar progress={this.state.progress} active={this.state.active}/>
            </div>
        )
    }
}

class VideoFormats extends React.Component<Props, State> {
    constructor(props:any) {
        super(props);
    }
    render() {
        return (
            <div>
               <p> <button type="button" className="ui button" onClick={this.props.handleFormats}>Get Available Formats</button></p>
          
                <label htmlFor="vidFormat">Video Format:</label>
                <select name="vidFormat" className="fluid dropdown">
                    {this.props.formats.map((format, index) => <option key={index} value={format.formatId}>{format.format} - {format.filesize}</option>)}
                </select>
             
            </div>
        )
    }
}

class ProgressBar extends React.Component<Props, State> {
   
    constructor(props:any) {
        super(props);
        this.state = {
            progress: 0,
            active: ''
        }
    }
    render() {
        return (
            <div>
                <div className={`ui indicating progress ${this.props.active}`} data-percent={this.props.progress}>
                    <div className="bar" style={{ "transitionDuration": 300 + 'ms', width: this.props.progress + '%' }}></div>
                    <div className="label">{this.props.progress}% Complete</div>
                </div>
            </div>
        )
    }
}

function App() {
    return (
        <div>
            <VideoDownload />
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('app'));


