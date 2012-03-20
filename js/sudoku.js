/**
 * @author Tamas_Szebeni
 */
/*globals $*/
$(document).ready(function() {
    var SudokuModel, SudokuView, SudokuPresenter;
    
    function everyThird(index) {
        return (index % 3 === 2);
    }

    SudokuModel = function () {
        this.reset();
        this.data = {};
    };

    SudokuModel.prototype = {
        load: function (id, callback) {
            var model = this;
            this.reset();
            $.getJSON("service/sudoku.json",null,function (data) {
                model.data = data;
                if (callback && $.isFunction(callback)) {
                    callback();
                }
            });
        },
        reset: function () {
            this.cells = new Array(81);
        },
        getData: function () {
            return this.data;
        }
    };

    SudokuView = function () {
        this.$container = $("#sudoku");
        this.$table = $("table tbody", this.$container);
        this.$new = $(".new", this.$container);
        this.$reset = $(".reset", this.$container);
        this.$check = $(".check", this.$container);
    };

    SudokuView.prototype = {
        init: function(presenter) {
            this.presenter = presenter;
            this.$new.click($.proxy(presenter.onCreate, presenter));
            this.$reset.click($.proxy(presenter.onReset, presenter));
            this.$check.click($.proxy(presenter.onCheck, presenter));
        },
        highlight: function () {
        },
        renderTable: function (data) {
            this.$table.empty();
            for (var i = 0; i < 9; i++) {
                var row = "<tr>";
                for (var j = 0; j < 9; j++) {
                    var value = data[i * 9 + j];
                    if (value === 0) {
                        row += "<td><input type=\"text\" maxlength=\"1\" size=\"1\" /></td>";
                    } else {
                        row += "<td>"+ value +"</td>";
                    }
                }
                row += "</tr>";
                this.$table.append(row);
            }
            this.$table.children().filter(everyThird).addClass("floor");
            this.$table.children().each(function (i, elem) {
                $(elem).find("td").filter(everyThird).addClass("wall");
            });
        }
    };

    SudokuPresenter = function (view,model) {
        this.view = view;
        this.model = model;
        this.view.init(this);
        
    };

    SudokuPresenter.prototype = {
        onCheck: function () {
            var $tds = this.$table.find("td");
            for (var i=0; i < 81; i++) {
                if (his.model.data.full[i] === parseInt($tds.eq(i).text(), 10)) {
                    // TODO good
                } else {
                    // TODO not good
                    
                }
            };
        },
        onReset: function () {},
        onCreate: function () {
            this.model.load(1,$.proxy(function () {
                this.view.renderTable(this.model.data.table);
            },this));
        }
    };

    /**
     * Initialization logic.
     */
    (function () {
        var model = new SudokuModel(),
            view = new SudokuView(),
            presenter = new SudokuPresenter(view, model);
    })();
});