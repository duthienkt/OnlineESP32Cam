function ESP32Camera(props) {
    this.conection = null;
    this.dataListener = [];
    Object.assign(this, props);

}


ESP32Camera.prototype.attachConnection = function(conection) {
    this.conection = conection;
    conection.on('data', this.ev_data.bind(this));
    conection.on('close', this.ev_close.bind(this, conection));
};

ESP32Camera.prototype.ev_close = function(conection) {
    if (this.conection == conection) this.conection = null;
};

ESP32Camera.prototype.ev_data = function(data) {
    var self = this;
    this.dataListener = this.dataListener.filter(function(cb) {
        var fineCallback = true;
        try {
            cb.call(self, data, self);
        }
        catch (e) {
            fineCallback = false;
            console.error(e);
            console.info("- Auto remove callback to keep free");
        }
        return fineCallback;
    });

};

ESP32Camera.prototype.addEventDataListener = function(cb) {
    if (this.dataListener.indexOf(cb) < 0) {
        this.dataListener.push(cb);
    }
};


ESP32Camera.prototype.removeEventDataListener = function(cb) {
    var idx = this.dataListener.indexOf(cb);
    if (idx >= 0) {
        this.dataListener.splice(idx, 1);
    }
};

ESP32Camera.prototype.queryName = function() {
    var conection = this.conection;
    return new Promise(function(rs, rj) {
        var resolved = false;
        var onData = function(data) {

        }
        try {
            if (conection) {
                setTimeout(function() {
                    if (!resolved) {
                        conection.off('data', onData);
                        rs(false);

                    }
                }, 5000);
            }
        }
        catch (error) {

        }


    });

};
