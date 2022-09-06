define([
    'coreJS/adapt',
    'coreViews/componentView',
    'libraries/chart.min'
], function (Adapt, ComponentView, Chart) {

    var ChartJSView = ComponentView.extend({

        events: {

        },

        preRender: function () {
            this.listenTo(Adapt, 'device:resize', this.onScreenSizeChanged);
            this.listenTo(Adapt, 'device:changed', this.onDeviceChanged);
            this.listenTo(Adapt, 'accessibility:toggle', this.onAccessibilityToggle);
            this.listenTo(this.model, 'change:data', this.onDataChanged);
            this.checkIfResetOnRevisit();
        },

        postRender: function () {
            this.dynamicInsert()
            this.setupChart();
            this.$('.component-widget').on('inview', _.bind(this.inview, this));
        },

        dynamicInsert: async function () {
            // remove "data" model object
                var dataURL = this.model.get('data').datasets[0].dataURL;
                const fetchJson = async () => {
                    const response = await fetch(dataURL)
                    const json = await response.json()
                    // urlData = json
                    return json
                }
                return await fetchJson();
        },

        setupChart: async function () {
            var ctx = $("#myChart" + this.model.get('_id'));

            this.model.get('data').datasets[0].data = await this.dynamicInsert()
            
            var chart = new Chart(ctx, {
                type: this.model.get('_chartType'),
                data: await this.model.get('data'),
                options: this.model.get('_options')
            });

            this.setReadyStatus();

            this.model.set("_chart", chart);
        },
        // create funciton which gets fetched data and sets it to the data model object


        onDataChanged: function () {
            var chart = this.model.get("_chart");
            console.log(chart)

            if (chart) {
                chart.update();
            }
        },

        setupEventListeners: function () {

        },

        checkIfResetOnRevisit: function () {
            var isResetOnRevisit = this.model.get('_isResetOnRevisit');

            // If reset is enabled set defaults
            if (isResetOnRevisit) {
                this.model.reset(isResetOnRevisit);
            }
        },

        inview: function (event, visible, visiblePartX, visiblePartY) {
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
        },

        remove: function () {
            if ($("html").is(".ie8")) {
                var obj = this.$("object")[0];
                if (obj) {
                    obj.style.display = "none";
                }
            }
            this.$('.component-widget').off('inview');
            ComponentView.prototype.remove.call(this);
        },

        onCompletion: function () {
            this.setCompletionStatus();
        },

        onDeviceChanged: function () {

        },

        onScreenSizeChanged: function () {

        },

        onAccessibilityToggle: function () {

        }

    });

    return ChartJSView;

});