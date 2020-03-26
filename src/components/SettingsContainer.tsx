import Box from '@material-ui/core/Box';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';


const styles = createStyles((theme: Theme) => ({
  root: {
    height: '100%',
  }
}));


export default withStyles(styles)(Box)