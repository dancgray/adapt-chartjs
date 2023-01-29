
    import Adapt from 'core/js/adapt';
    import ComponentView from 'core/js/views/componentView';
    import Chart from 'libraries/chart.min'
    
    export default class ChartJSView extends ComponentView {
  
        preRender() {
            this.listenTo(this.model, 'change:data', this.onDataChanged);
        }

        postRender() {
            this.setupChart();
            this.setupInview();
        }

        setupInview() {
            const selector = this.getInviewElementSelector();
            if (!selector) return this.setCompletionStatus();
            this.setupInviewCompletion(selector);
        }

        getInviewElementSelector() {
            if (this.model.get('body')) return '.component__body';
            if (this.model.get('instruction')) return '.component__instruction';
            if (this.model.get('displayTitle')) return '.component__title';
            return null;
        }

        async dynamicInsert (dataURL) {
                const fetchJson = async () => {
                    const response = await fetch(dataURL)
                    const json = await response.json()
                    return json
                }
                return await fetchJson();
        }

        async setupChart () {
            var ctx = $("#myChart" + this.model.get('_id'));

            await Promise.all(this.model.get('data').datasets.map(async (dataset) => {
                if (dataset.dataURL) {
                    dataset.data = await this.dynamicInsert(dataset.dataURL);
                }
            }));

            var chart = new Chart(ctx, {
                type: this.model.get('_chartType'),
                data: await this.model.get('data'),
                options: this.model.get('_options')
            });

            this.setReadyStatus();

            this.model.set("_chart", chart);
        }
        
        onDataChanged() {
            var chart = this.model.get("_chart");
            console.log(chart)

            if (chart) {
                chart.update();
            }
        }

    }