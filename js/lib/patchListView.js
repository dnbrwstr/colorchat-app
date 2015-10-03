import { ListView } from 'react-native';

ListView.prototype.componentWillReceiveProps = function (nextProps) {
  if (this.props.dataSource !== nextProps.dataSource) {
    this.setState((state, props) => {
      var rowsToRender = Math.min(
        // This is the patch
        // ================
        // state.curRenderedRowsCount + props.pageSize,
        // ================
        Math.max(state.curRenderedRowsCount, props.pageSize) + 1,
        // ================
        props.dataSource.getRowCount()
      );
      return {
        prevRenderedRowsCount: 0,
        curRenderedRowsCount: rowsToRender,
      };
    });
  }
};