
    import Adapt from 'core/js/adapt';
    import ComponentView from 'core/js/views/componentView';
    import Chart from 'libraries/chart.min'
    
    export default class ChartJSView extends ComponentView {
  
        preRender() {
            this.listenTo(Adapt, 'device:resize', this.onScreenSizeChanged);
            this.listenTo(Adapt, 'device:changed', this.onDeviceChanged);
            this.listenTo(Adapt, 'accessibility:toggle', this.onAccessibilityToggle);
            this.listenTo(this.model, 'change:data', this.onDataChanged);
            // this.checkIfResetOnRevisit();
        }

        postRender() {
            this.dynamicInsert()
            this.setupChart();
            this.$('.component-widget').on('inview', _.bind(this.inview, this));
        }

        async dynamicInsert () {
                var dataURL = this.model.get('data').datasets[0].dataURL;
                const fetchJson = async () => {
                    const response = await fetch(dataURL)
                    const json = await response.json()
                    return json
                }
                return await fetchJson();
        }

        async setupChart () {
            var ctx = $("#myChart" + this.model.get('_id'));

            this.model.get('data').datasets[0].data = await this.dynamicInsert()

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

        setupEventListeners() {

        }

        checkIfResetOnRevisit() {
            var isResetOnRevisit = this.model.get('_isResetOnRevisit');

            // If reset is enabled set defaults
            if (isResetOnRevisit) {
                this.model.reset(isResetOnRevisit);
            }
        }

        inview(event, visible, visiblePartX, visiblePartY) {
            if (visible) {
                if (visiblePartY === 'top') {
                    this._isVisibleTop = true;
                } else if (visiblePartY === 'bottom') {
                    this._isVisibleBottom = true;
                } else {
                    this._isVisibleTop = true;
                    this._isVisibleBottom = true;
                }

                if (this._isVisibleTop && this._isVisibleBottom) {
                    this.$('.component-inner').off('inview');
                    this.setCompletionStatus();
                }
            }
        }

        remove() {
            if ($("html").is(".ie8")) {
                var obj = this.$("object")[0];
                if (obj) {
                    obj.style.display = "none";
                }
            }
            this.$('.component-widget').off('inview');
            ComponentView.prototype.remove.call(this);
        }

        onCompletion() {
            this.setCompletionStatus();
        }

        onDeviceChanged() {

        }

        onScreenSizeChanged() {

        }

        onAccessibilityToggle() {

        }

    }