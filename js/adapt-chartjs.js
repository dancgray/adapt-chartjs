
import Adapt from 'core/js/adapt';
import ChartJSView from './ChartJSView';
import ChartJSModel from './ChartJSModel';

export default Adapt.register("chartjs", {
    view: ChartJSView,
    model: ChartJSModel
});

