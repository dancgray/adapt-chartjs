
    import Adapt from 'core/js/adapt';
    import ComponentView from 'core/js/views/componentView';
    import Chart from 'libraries/chart.min'
    
    export default class ChartJSView extends ComponentView {
  
        preRender() {
            this.listenTo(this.model, 'change:data', this.onDataChanged);
        }

        postRender() {
            this.dynamicInsert()
            this.setupChart();
            this.setupInview();
        }

        setupInview() {
            const selector = this.getInviewElementSelector();
            if (!selector) return this.setCompletionStatus();
            this.setupInviewCompletion(selector);
        }

        /**
            * determines which element should be used for inview logic - body, instruction or title - and returns the selector for that element
        */
        getInviewElementSelector() {
            if (this.model.get('body')) return '.component__body';
            if (this.model.get('instruction')) return '.component__instruction';
            if (this.model.get('displayTitle')) return '.component__title';
            return null;
        }

        async dynamicInsert (dataURL) {
                //var dataURL = this.model.get('data').datasets[0].dataURL;
                const fetchJson = async () => {
                    const response = await fetch(dataURL)
                    const json = await response.json()
                    return json
                }
                return await fetchJson();
        }

        async setupChart () {
            var ctx = $("#myChart" + this.model.get('_id'));

            this.model.get('data').datasets.map( await dataset => {
                console.log(dataset);
                if (dataset.dataURL) {
                    dataset.data = this.dynamicInsert(dataset.dataURL);
                }
            });
            //this.model.get('data').datasets[0].data = await this.dynamicInsert()

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