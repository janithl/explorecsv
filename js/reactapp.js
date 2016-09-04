const ipc       = require('electron').ipcRenderer;
const fs        = require('fs');
const Baby      = require('babyparse');

class TableRow extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        var rowdata = [];
        for(var cell in this.props.row) {
            rowdata.push(<td>{this.props.row[cell]}</td>);
        }

        return (
            <tr>{rowdata}</tr>
        );
    }
}

class Table extends React.Component {
    render() {
        if(!this.props.file) {
            return <table />
        }

        console.log(JSON.stringify(this.props.file));

        var header = [];
        if(this.props.file.meta) {
            header = this.props.file.meta.fields;
        }

        var headerdata = header.map((h) => {
            return <th>{h}</th>;
        });

        var tabledata = this.props.file.data.map((row) => {
            return (
                <TableRow row={row} />
            );
        });

        return (
            <table className="table-striped">
                <thead>
                    <tr>{headerdata}</tr>
                </thead>
                <tbody>
                    {tabledata}
                </tbody>
            </table>
        );
    }
}

class ExploreCSV extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null
        };

        this.openFile       = this.openFile.bind(this);
        this.fileSelected   = this.fileSelected.bind(this);
    }
/*    viewFolder() {
        var _self = this;
        setTimeout(() => {
            fs.readdir('/' + this.state.path.join('/'), (err, data) => {
                if (err) throw err;
                _self.setState({files: data});
            });
        }, 100);
    }
    openFolder(event, path) {
        this.setState({path: this.state.path.concat(path)});
        this.viewFolder();
    }
    selectFolder() {
        
    }*/
    openFile() {
        ipc.send('open-file-dialog');
    }
    fileSelected(event, path) {
        this.setState({
            file: Baby.parseFiles(path[0], { delimiter: ",", newline: "\n", header: true })
        });

    }
    componentDidMount() {
        ipc.on('selected-file', this.fileSelected);
    }
    render() {

        var footer = null;
        if(this.state.file && this.state.file.errors.length > 0) {
            footer = <footer className="toolbar toolbar-footer">
                <h1 className="title">{this.state.file.errors[0].message}</h1>
            </footer>
        }

        return (
            <div className="window">
                <header className="toolbar toolbar-header">
                    <h1 className="title">ExploreCSV</h1>

                    <div className="toolbar-actions">
                        <div className="btn-group">
                            <button className="btn btn-default" onClick={this.openFile}>
                                <span className="icon icon-folder" />
                            </button>
                        </div>
                    </div>
                </header>

                <div className="window-content">
                    <div className="pane-group">
                        <div className="pane-sm sidebar">
                            
                        </div>
                        <div className="pane">
                            <Table file={this.state.file} />
                        </div>
                    </div>
                </div>     

                {footer}           
            </div>
        );
    }
}

ReactDOM.render(<ExploreCSV />, document.getElementById('window'));