import React, { Component } from 'react';
import '../styles/home.css';
import { Redirect } from 'react-router-dom';
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import NavBarComponent from './NavBarComponent';
import ApiHelper from '../helpers/ApiHelper';
import {
    Getter,
} from '@devexpress/dx-react-core';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import {
    
    SortingState,
    IntegratedSorting,
    SearchState,
    IntegratedFiltering,
    EditingState,
    DataTypeProvider
} from '@devexpress/dx-react-grid';
import {
    Grid,
    VirtualTable,
    Toolbar,
    SearchPanel,
    TableHeaderRow,
    TableEditRow,
    TableEditColumn,
} from '@devexpress/dx-react-grid-material-ui';
import CreateCampaign from './CampaignCrud/CreateCampaign';
import DeleteCampaign from './CampaignCrud/DeleteCampaign';

const getRowId = row => row.id;

const DateFormatter = ({ value }) =>
    new Date(value).toLocaleString();
const DateTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={DateFormatter}
        {...props}
    />
);

class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            popupVisible: false,
            activeRow: {},
            columns: [
                { name: 'name', title: 'Campaign' },
                { name: 'createdAt', title: 'Date Created' },
                { name: 'url', title: 'URL' },
            ],
            dateColumns: ['createdAt'],
            editingStateColumnExtensions: [
                { columnName: 'id', editingEnabled: false },
                { columnName: 'name', editingEnabled: false },
                { columnName: 'createdAt', editingEnabled: false },
            ],
            campaignItems: [],
            showCreatePopup: false,
            showDeletePopup: false,
            showUpdate: false,
            deleteId: null,
            selectedCampaignId: null,


        };
        this.fetchCampaigns = this.fetchCampaigns.bind(this);
        this.toggleDeletePopup = this.toggleDeletePopup.bind(this);
        this.closePopup = () => {
            this.setState({ popupVisible: false, activeRow: {} });
        };
        this.myUpdate = this.myUpdate.bind(this);
        this.myDelete = this.myDelete.bind(this);
    }

    componentDidMount() {
        this.setState({ selectedCampaignId: null });
        this.fetchCampaigns();
    }

    fetchCampaigns() {
        ApiHelper.fetch('api/campaigns', {
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("token")
            }
        })
            .then(res => {
                this.setState({ campaignItems: res });
                console.log(res)
            })
            .catch(err => {
                console.error(err);
            })
    }

    toggleCreatePopup() {
        this.setState({
            showCreatePopup: !this.state.showCreatePopup
        });
    }
    toggleDeletePopup() {
        this.setState({
            showDeletePopup: !this.state.showDeletePopup
        });
    }

    renderRedirect = () => {
        if (this.state.showUpdate) {
            return <Redirect to={{
                pathname: '/campaignview',
                state: { selectedCampaignId: this.state.selectedCampaignId }
            }}
            />
        }
    }

    myUpdate(row) {
        this.setState({
            selectedCampaignId: row.id,
            showUpdate: true
        })
    }
    myDelete(row) {
        this.setState({
            deleteId: row.id,
            showDeletePopup: true
        })
    }
    copyUrl(row) {
        window.alert("URL Copied to clipboard!")
        var textArea = document.createElement("textarea");
        textArea.value = row.url;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Fallback: Copying text command was ' + msg);
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }

        document.body.removeChild(textArea);

    }

    render() {
        const {
            campaignItems,
            columns,
            dateColumns,
            editingStateColumnExtensions,
            rows, popupVisible, activeRow
        } = this.state;
        const showDetails = row => {
            this.myUpdate(row)
        }; 
        const deleteCampaign = row => {
            this.myDelete(row)
        };
        const copyDetails = row => {
            this.copyUrl(row)
        };
        const CellComponent = ({ children, row, ...restProps }) => (
            <TableEditColumn.Cell row={row} {...restProps}>
                {children}
                <TableEditColumn.Command
                    id="custom"
                    class="fas fa-copy"
                    onExecute={() => {
                        copyDetails(row);
                    }} // action callback
                />
                <TableEditColumn.Command
                    id="custom"
                    class="fas fa-edit"
                    onExecute={() => {
                        showDetails(row);
                    }} // action callback
                />

                <TableEditColumn.Command
                    id="custom"
                    class="fas fa-trash"
                    onExecute={() => {
                        deleteCampaign(row);
                    }} //action callback
                />
            </TableEditColumn.Cell>
        );

        const TableRow = ({ row, ...restProps }) => (
            <VirtualTable.Row
                {...restProps}
                onClick={() => showDetails(row)}
                style={{
                    cursor: 'pointer',
                }}
            />
        );

        return (

            <div>
                <NavBarComponent></NavBarComponent>
                <div className="Home">

                    <h2>Scratch &amp; Win Campaigns</h2>
                    <div className="container">
                        <Paper>
                            <Grid
                                rows={campaignItems}
                                columns={columns}
                                getRowId={getRowId}
                            >
                                <EditingState
                                    onCommitChanges={this.commitChanges}
                                />
                                <DateTypeProvider
                                    for={dateColumns}
                                />

                      
                                <Fab
                                    color="primary"
                                    aria-label="add"
                                    className="add-btn"
                                    onClick={this.toggleCreatePopup.bind(this)}>
                                    +
                                </Fab>

                                <i></i>

                                {this.state.showCreatePopup ?
                                    <CreateCampaign
                                        closePopup={this.toggleCreatePopup.bind(this)}
                                    />
                                    : null
                                }

                                {this.state.showDeletePopup ?
                                    <DeleteCampaign
                                        deleteId={this.state.deleteId}
                                        closePopup={this.toggleDeletePopup.bind(this)}
                                    />
                                    : null
                                }

                                {this.renderRedirect()}

                                <SortingState
                                    defaultSorting={[
                                        { columnName: 'name', direction: 'asc' },
                                        { columnName: 'created_by', direction: 'asc' },
                                        { columnName: 'url', direction: 'asc' }
                                    ]}
                                />
                                <IntegratedSorting />
                                <SearchState defaultValue="" />
                                <IntegratedFiltering />
                                <VirtualTable rowComponent={TableRow} />
                                <TableHeaderRow showSortingControls />
                                <TableEditRow />
                                <TableEditColumn
                                    width={170}
                                    cellComponent={CellComponent}
                                />
                                <Getter
                                    name="tableColumns"
                                    computed={({ tableColumns }) => {
                                        const result = [
                                            ...tableColumns.filter(c => c.type !== TableEditColumn.COLUMN_TYPE),
                                            { key: 'editCommand', type: TableEditColumn.COLUMN_TYPE, width: 140 }
                                        ];
                                        return result;
                                    }
                                    }
                                />
                                <Toolbar />
                                <SearchPanel />
                            </Grid>
                        </Paper>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;