function Gauge(title, configuration){

	setAssumed = function(object, att, def){
		return object.hasOwnProperty(att) ? object[att] : def;
	}
	//setAssumed checks whether the property exists in the configuration passed in and returns a default if not
	//allows the configure function to be very customizable and not require setters
	//We could make it so that it could retain previous config methods if that is required: 
	// setAssumed = function(classObject, paramObject, att, def, retainValue){
	// 	if(retainValue){
	// 		return paramObject.hasOwnProperty(att) ? paramObject[att] : classObject.hasOwnProperty(att) ? classObject[att]: def;
	// 	}

	// 	else {
	// 		return paramObject.hasOwnProperty(att) ? paramObject[att] : def;
	// 	} 
	// //retainValue should be a boolean primitive.		
	// }

	this.configure = function(title, configuration){
		this.title = title;

		if(!configuration){
			configuration = {};
		}

		this.config = configuration;
		
		this.config.size = setAssumed(configuration, 'size', 200);
		this.config.startX = setAssumed(configuration, 'startX', 0);
		this.config.startY = setAssumed(configuration, 'startY', 0);
		
		this.config.cx = this.config.startX + this.config.size / 2;
		this.config.cy = this.config.startY + this.config.size / 2;
		
		this.config.duration = setAssumed(configuration, "duration", 3000);
		
		this.config.min = setAssumed(configuration, "min", 0);
		this.config.max = setAssumed(configuration, "max", 100);
		this.config.range = this.config.max - this.config.min;
		
		this.config.defaultValue = setAssumed(configuration, "defaultValue", this.config.min);
		
		this.config.gaugeColor = setAssumed(configuration, "gaugeColor", "black");
		this.config.radius = this.config.size * 0.485;
		
		this.config.majorTickers = setAssumed(configuration, "majorTickers", 14);
		this.config.minorPerMajor = setAssumed(configuration, "minorPerMajor", 1);
		this.config.tickerColor = setAssumed(configuration, "tickerColor", "#00FA9A");
		this.config.majorTickerWidth = setAssumed(configuration, "majorTickerWidth", this.config.size * 0.02);
		this.config.majorTickerLength = setAssumed(configuration, "majorTickerLength",this.config.size * 0.12);
		this.config.minorTickerWidth = setAssumed(configuration, "minorTickerWidth", this.config.size * 0.02);
		this.config.minorTickerLength = setAssumed(configuration, "minorTickerLength", this.config.size * 0.07);
		this.config.totalTickers = this.config.majorTickers * (1 + this.config.minorPerMajor);
		this.config.tickersPerSect = 1 + this.config.minorPerMajor;
		this.config.tickerAngle = 240 / this.config.totalTickers;
		this.config.tickerRadius = setAssumed(configuration, "tickerRadius", this.config.radius * 0.7);
		
		this.config.spinnerFillColor = setAssumed(configuration, "spinnerFillColor", "black");
		this.config.spinnerStrokeColor = setAssumed(configuration, "spinnerStrokeColor", "#00FA9A");
		this.config.spinnerRadius = setAssumed(configuration, "spinnerRadius", this.config.size * 0.13);
		
		this.config.pointerColor = setAssumed(configuration, "pointerColor", "#00FA9A");
		this.config.pointerLength = setAssumed(configuration, "pointerLength", this.config.radius * 0.8);
		this.config.pointerWidth = setAssumed(configuration, "pointerWidth", this.config.size * 0.1);

		this.setValue();
	} 

	this.refreshDash = function(){
		this.paper.clear();
		this.createDash();
	}

	this.createCircle = function(paper){
		gaugeCircle = paper.circle(this.config.cx, this.config.cy, this.config.radius).attr("fill",this.config.gaugeColor);
	}

	this.createMinTickers = function(paper){
		for (i = -210; i <= 30; i+=this.config.tickerAngle){
			var radiusVector = [
				this.config.tickerRadius * math.cos(math.unit(i, 'deg')), 
				this.config.tickerRadius * math.sin(math.unit(i, 'deg'))
			];
			var unitRadiusVector = [math.cos(math.unit(i, 'deg')), math.sin(math.unit(i, 'deg'))];

			var point0 = [this.config.cx + radiusVector[0], this.config.cy + radiusVector[1]];
			
			var point1 = [
				point0[0] - (this.config.minorTickerWidth / 2) * unitRadiusVector[1], 
				point0[1] + (this.config.minorTickerWidth / 2) * unitRadiusVector[0]
			];

			var point2 = [
				point1[0] + this.config.minorTickerLength * unitRadiusVector[0],
				point1[1] + this.config.minorTickerLength * unitRadiusVector[1]
			];

			var point3 = [
				point2[0] + this.config.minorTickerWidth * unitRadiusVector[1],
				point2[1] - this.config.minorTickerWidth * unitRadiusVector[0]
			];

			var point4 = [
				point3[0] - this.config.minorTickerLength * unitRadiusVector[0],
				point3[1] - this.config.minorTickerLength * unitRadiusVector[1]
			];

			var pathString = "M" + String(point0[0]) + "," + String(point0[1]) + "L" + String(point1[0]) + "," + String(point1[1]) + 
							 "L" + String(point2[0]) + "," + String(point2[1]) + "L" + String(point3[0]) + "," + String(point3[1]) +
						 	 "L" + String(point4[0]) + "," + String(point4[1]) + "z";
			
			paper.path(pathString).attr("fill",this.config.tickerColor);
		}
	}

	this.CreateMajTickers = function(paper){
		for (i = -210; i <= 30; i+=this.config.tickerAngle * this.config.tickersPerSect){
			var radiusVector = [
					this.config.tickerRadius * math.cos(math.unit(i, 'deg')),
			 		this.config.tickerRadius * math.sin(math.unit(i, 'deg'))
			 	];
			var unitRadiusVector = [math.cos(math.unit(i, 'deg')), math.sin(math.unit(i, 'deg'))];

			var point0 = [this.config.cx + radiusVector[0], this.config.cy + radiusVector[1]];
			
			var point1 = [
					point0[0] - (this.config.majorTickerWidth / 2) * unitRadiusVector[1], 
					point0[1] + (this.config.majorTickerWidth / 2) * unitRadiusVector[0]
				];

			var point2 = [
					point1[0] + this.config.majorTickerLength * unitRadiusVector[0],
					point1[1] + this.config.majorTickerLength * unitRadiusVector[1]
				];

			var point3 = [
					point2[0] + this.config.majorTickerWidth * unitRadiusVector[1],
					point2[1] - this.config.majorTickerWidth * unitRadiusVector[0]
				];

			var point4 = [
					point3[0] - this.config.majorTickerLength * unitRadiusVector[0],
					point3[1] - this.config.majorTickerLength * unitRadiusVector[1]
				];

			var pathString = "M" + String(point0[0]) + "," + String(point0[1]) + "L" + String(point1[0]) + "," + String(point1[1]) + 
						 	 "L" + String(point2[0]) + "," + String(point2[1]) + "L" + String(point3[0]) + "," + String(point3[1]) +
						 	 "L" + String(point4[0]) + "," + String(point4[1]) + "z";
			
			paper.path(pathString).attr("fill",this.config.tickerColor);
		}
	}

	this.createPointer = function(paper){
		var defaultAngle = (this.config.defaultValue - this.config.min) * (240 / this.config.range) - 210;
		var radiusVector = [
				this.config.pointerLength * math.cos(math.unit(defaultAngle, 'deg')), 
				this.config.pointerLength * math.sin(math.unit(defaultAngle, 'deg'))
			];

		var unitRadiusVector = [math.cos(math.unit(defaultAngle, 'deg')), math.sin(math.unit(defaultAngle, 'deg'))];
		
		var point0 = [this.config.cx, this.config.cy];

		var point1 = [
				this.config.cx - (this.config.pointerWidth / 2) * unitRadiusVector[1],
				this.config.cy + (this.config.pointerWidth / 2) * unitRadiusVector[0]
			];

		var point2 = [
				this.config.cx + radiusVector[0], 
				this.config.cy + radiusVector[1]
			];

		var point3 = [
				this.config.cx + (this.config.pointerWidth / 2) * unitRadiusVector[1],
				this.config.cy - (this.config.pointerWidth / 2) * unitRadiusVector[0],
			];
		
		var pointerString = "M" + String(point0[0]) + "," + String(point0[1]) + "L" + String(point1[0]) + "," + String(point1[1]) +
							"L" + String(point2[0]) + "," + String(point2[1]) + "L" + String(point3[0]) + "," + String(point3[1]) +
							"z";

		this.pointer = paper.path(pointerString).attr("fill", this.config.pointerColor);
	}

	this.createSpinner = function(paper){
		var spinner = paper.circle(this.config.cx, this.config.cy, this.config.spinnerRadius).attr({fill : this.config.spinnerFillColor, stroke : this.config.spinnerStrokeColor});
	}

	this.createDash = function(){
		this.paper = Raphael(this.config.startX, this.config.startY, this.config.size, this.config.size);
		this.createCircle(this.paper);
		this.createMinTickers(this.paper);
		this.CreateMajTickers(this.paper);
		this.createSpinner(this.paper);
		this.createPointer(this.paper);
	}


	this.setValue = function(data){
		if(data){
			this.value = 0;
			for (i=0; i < data.length; i++){
				this.value += data[i];
			}
			this.value = this.value/data.length;
		}
		else
			this.value = this.config.defaultValue;
	}

	
	this.draw = function(data){
		var priorValue = this.value;
		this.setValue(data);
		var rotAngle = (this.value - priorValue) * 240 / this.config.range;
		var rotString = "r" + String(rotAngle) + "," + String(this.config.cx) + "," + String(this.config.cy);
		this.pointer.animate({transform : rotString}, this.config.duration);
	}

	this.configure(title,configuration);
}
	

