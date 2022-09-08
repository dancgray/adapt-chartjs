
import Adapt from 'core/js/adapt';
import ChartJSView from './chartjsView';
import ChartJSModel from './chartjsModel';

export default Adapt.register("chartjs", {
    view: ChartJSView,
    model: ChartJSModel
});

