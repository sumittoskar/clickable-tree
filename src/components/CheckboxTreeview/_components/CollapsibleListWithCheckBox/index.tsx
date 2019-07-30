import React, { FunctionComponent, Fragment } from 'react';
import {
    Checkbox,
    List,
    ListItem,
    ListItemText,
    Collapse,
    Typography,
    TextField,
    makeStyles,
    createStyles,
    Theme,
    IconButton,
    Box
} from '@material-ui/core';
import { AddBoxOutlined, IndeterminateCheckBoxOutlined, Remove } from '@material-ui/icons';
import { map, isArray,indexOf} from 'lodash';
import { ClListProps, ClListItem, ClListState } from './_dataTypes';
import NodeModel from './_nodeModel';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            maxWidth: 360,
            backgroundColor: theme.palette.background.paper,
        },
        nested: {
            paddingLeft: theme.spacing(4),
        }
    }),
);

const CheckBoxList: FunctionComponent<ClListProps> = (props) => {
  
    const classes = useStyles();
    const initialChecked: Array<string|number> = [];
    const initialOpen: Array<string|number> = [];
    const initialSearch: string = ''
    const [treeState, setTreeState] = React.useState<ClListState>({checked:initialChecked, open:initialOpen, search:initialSearch});
    const [searchString, setSearch] = React.useState("");
    let nodes: NodeModel = new NodeModel(props.items, treeState, searchString);
    
    const handleOpen = (value: string|number) => () => {
        nodes.selectOpen(value);
        setTreeState({checked: [...treeState.checked], open: nodes.open, search: treeState.search});
    };

    const handleToggle = (value: string|number) => () => {
        if(indexOf(treeState.checked, value) === -1) {
            nodes.selectItems(value);
        } else {
            nodes.deSelectItems(value);
        }
        setTreeState({open: [...treeState.open], checked: nodes.checked, search: treeState.search});
    };

    const handleSearch = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
      };
    

    const getlist = (items?: Array<ClListItem>, depth: number = 0) => {

        depth++;
        const list = map(items, listItem => {
            return (
                <Fragment key={`fragment-${listItem.value}`}>
                    <ListItem key={listItem.value} role={undefined} >
                        <IconButton  onClick={handleOpen(listItem.value)}>
                            {isArray(listItem.children) && listItem.children.length > 0 ? (treeState.open.indexOf(`${listItem.value}`) !== -1 ? <IndeterminateCheckBoxOutlined /> : <AddBoxOutlined />) : <Remove />}
                        </IconButton>
                            <Checkbox
                                edge="start"
                                checked={treeState.checked.indexOf(listItem.value) !== -1}
                                tabIndex={-1}
                                disableRipple
                                onClick={handleToggle(listItem.value)}
                            />
                        <ListItemText id={listItem.label} primary={listItem.label} />
                    </ListItem>
                    <Collapse in={true/*treeState.open.indexOf(`${listItem.value}`) !== -1*/}>
                        {getlist(listItem.children, depth)}
                    </Collapse>
                </Fragment>
            )
        });
        if (depth === 1) {
            const allitem = (<ListItem key='all' role={undefined} >
                    <Checkbox
                        edge="start"
                        checked={treeState.checked.indexOf("all") !== -1}
                        tabIndex={-1}
                        disableRipple
                        onClick={handleToggle('all')}
                    />
                <ListItemText id="all" primary="All" />
            </ListItem>)
            list.unshift(allitem);
        }
        return (<List className={depth > 1 ? classes.nested : classes.root}>{list}</List>)


    }
    const selectedCount: number = nodes.getSelectedCount();
    const list = getlist(nodes.filterItems);
    return (
        <React.Fragment>
            {list}
            <Box p={2}>
                <Typography variant="subtitle1" >
                    {selectedCount > 0 ? `${selectedCount} node selected`: 'None selected'}
                </Typography>
                
            </Box>
            <Box>
                    <TextField
                        id="standard-name"
                        label="Name"
                        value={searchString}
                        onChange={handleSearch('name')}
                        margin="normal"
                    />
                </Box>
        </React.Fragment>
    )
}

export * from './_dataTypes';
export default CheckBoxList;