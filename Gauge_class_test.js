
function Gauge(){

	setAssumed = function(att, def){
		att !== 'undefined' ? att : def;
	}

	this.init = function(){
		this.setLocation();
		this.setTransDur();
		this.setExtrema();
		this.setTickerSettings();
		this.setGaugeSettings();
		this.setSpinnerSettings();
		this.setPointerSettings();
		this.setDefault();
	}

	this.setLocation = function(size, startX, startY){
		this.size = setAssumed(size, 100);
		this.startX = setAssumed(startX, 0);
		this.startY = setAssumed(startY, 0);
		this.cx = startX + size / 2;
		this.cy = startY + size / 2;
	}

	this.setTransDur = function(duration){
		this.transDur = setAssumed(duration, 3000);
	}

	this.setExtrema = function(min,max){
		this.min = setAssumed(min, 0);
		this.max = setAssumed(max, 100);
		this.range = max - min;
	}

	this.setTickerSettings = function(majorTickers, minorPerMajor, tickerColor, 
								      majorTickerWidth, majorTickerLength, 
								      minorTickerWidth, minorTickerLength){
		baseSize = this.size * .02;
		baseMajLength = this.size * .21;
		baseMinLength = this.size * .07;
		this.majorTickers = setAssumed(majorTicker, 15);
		this.minorPerMajor = setAssumed(minorPerMajor, 1);
		this.tickerColor = setAssumed(tickerColor, "#00FA9A");
		this.majorTickerWidth = setAssumed(majorTickerWidth, baseSize);
		this.minorTickerWidth = setAssumed(minorTickerWidth, baseSize);
		this.majorTickerLength = setAssumed(majorTickerLength, baseMajLength);
		this.minorTickerLength = setAssumed(minorTickerLength, baseMinLength);
		this.totalTickers = this.majorTickers + this.majorTickers * this.minorPerMajor - 1;
		this.tickersPerSect = this.majorTickers + this.minorPerMajor;
		this.tickerAngle = 240 / totalTickers;
		this.tickerRadius = this.radius * 0.8;
	}

	this.setGaugeSettings = function(gaugeColor){
		this.gaugeColor = setAssumed(gaugeColor, "black");
		this.radius = size * 0.5;
		//Possibly add angle setter
	}

	this.setSpinnerSettings = function(spinnerStrokeColor, spinnerFillColor,spinnerRadius){
		this.spinnerFillColor = setAssumed(spinnerFillColor, "black");
		this.spinnerStrokeColor = setAssumed(spinnerStrokeColor, "#00FA9A");
		this.spinnerRadius = setAssumed(spinnerRadius, this.size * 0.15);
	}

	this.setPointerSettings = function(pointerColor, pointerLength, pointerWidth){
		this.pointerColor = setAssumed(pointerColor, "#00FA9A");
		this.pointerLength = setAssumed(pointerLength, this.radius * 0.9);
		this.pointerWidth = setAssumed(pointerWidth, this.size * .05);
	}

	this.setTitle = function(title){
		this.title = title;
	}

	this.setDefault = function(defaultValue){
		this.defaultValue = setAssumed(defaultValue, 0);
	}

	this.createDash = function(){
		this.paper = Raphael(this.startX, this.startY, this.size, this.size);
		createCircle(this.paper);
		createMinTickers(this.paper);
		CreateMajTickers(this.paper);
		createPointer(this.paper);
		createSpinner(this.paper);
	}

	this.refreshDash = function(){
		this.paper.clear();
		this.createDash();
	}

	createCircle = function(paper){
		gaugeCircle = paper.circle(this.cx, this.cy, this.radius).attr("fill" : this.gaugeColor);
	}

	createMinTickers = function(paper){
		for (i = -30; i <= 210; i+=this.tickerAngle){
			var radiusVector = [this.tickerRadius * math.cos(math.unit(i, 'deg')), this.tickerRadius * math.sin(math.unit(i, 'deg'))];
			var unitRadiusVector = [math.cos(math.unit(i, 'deg')), math.sin(math.unit(i, 'deg'))];

			var point0 = [this.cx + radiusVector[0], this.cy + radiusVector[1]];
			
			var point1 = [
				point0[0] - (this.minorTickerWidth / 2) * unitRadiusVector[1], 
				point0[1] + (this.minorTickerWidth / 2) * unitRadiusVector[0]
			];

			var point2 = [
				point1[0] + this.minorTickerLength * unitRadiusVector[0],
				point1[1] + this.minorTickerLength * unitRadiusVector[1]
			];

			var point3 = [
				point2[0] + this.minorTickerWidth * unitRadiusVector[1],
				point2[1] - this.minorTickerWidth * unitRadiusVector[0]
			];

			var point4 = [
				point3[0] - this.minorTickerLength * unitRadiusVector[0],
				point3[1] - this.minorTickerLength * unitRadiusVector[1]
			];

			var pathString = "M" + String(point0[0]) + "," + String(point0[1]) + "L" + String(point1[0]) + "," + String(point1[1]) + 
							 "L" + String(point2[0]) + "," + String(point2[1]) + "L" + String(point3[0]) + "," + String(point3[1]) +
						 	 "L" + String(point4[0]) + "," + String(point4[1]) + "z";
			
			paper.path(pathString).attr("fill":this.tickerColor);
		}
	}

	createMajTickers = function(paper){
		for (i = -30; i <= 210; i+=this.tickerAngle*this.tickersPerSect){
			var radiusVector = [this.tickerRadius * math.cos(math.unit(i, 'deg')), this.tickerRadius * math.sin(math.unit(i, 'deg'))];
			var unitRadiusVector = [math.cos(math.unit(i, 'deg')), math.sin(math.unit(i, 'deg'))];

			var point0 = [this.cx + radiusVector[0], this.cy + radiusVector[1]];
			
			var point1 = [
					point0[0] - (this.majorTickerWidth / 2) * unitRadiusVector[1], 
					point0[1] + (this.majorTickerWidth / 2) * unitRadiusVector[0]
				];

			var point2 = [
					point1[0] + this.majorTickerLength * unitRadiusVector[0],
					point1[1] + this.majorTickerLength * unitRadiusVector[1]
				];

			var point3 = [
					point2[0] + this.majorTickerWidth * unitRadiusVector[1],
					point2[1] - this.majorTickerWidth * unitRadiusVector[0]
				];

			var point4 = [
					point3[0] - this.majorTickerLength * unitRadiusVector[0],
					point3[1] - this.majorTickerLength * unitRadiusVector[1]
				];

			var pathString = "M" + String(point0[0]) + "," + String(point0[1]) + "L" + String(point1[0]) + "," + String(point1[1]) + 
						 	 "L" + String(point2[0]) + "," + String(point2[1]) + "L" + String(point3[0]) + "," + String(point3[1]) +
						 	 "L" + String(point4[0]) + "," + String(point4[1]) + "z";
			
			paper.path(pathString).attr("fill" : this.tickerColor);
		}
	}

	createPointer = function(paper){
		var defaultAngle = (this.defaultValue - this.min) * (240 / this.range) - 30; 
		var radiusVector = [
			this.pointerLength * math.cos(math.unit(defaultAngle, 'deg')), 
			this.pointerLength * math.sin(math.unit(defaultAngle, 'deg'))
		];
		var unitRadiusVector = [math.cos(math.unit(defaultAngle, 'deg')), math.sin(math.unit(defaultAngle, 'deg'))];
		
		var point0 = [this.cx, this.cy];

		var point1 = [
				this.cx - (this.pointerWidth / 2) * unitRadiusVector[1],
				this.cy + (this.pointerWidth / 2) * unitRadiusVector[0]
			];

		var point2 = [
				this.cx + radiusVector[0], 
				this.cy + radiusVector[1]
			];

		var point3 = [
				this.cx + (this.pointerWidth / 2) * unitRadiusVector[1],
				this.cy - (this.pointerWidth / 2) * unitRadiusVector[0],
			];
		
		var pointerString = "M" + String(point0[0]) + "," + String(point0[1]) + "L" + String(point1[0]) + "," + String(point1[1]) +
							"L" + String(point2[0]) + "," + String(point2[0]) + "L" + String(point3[0]) + "," + String(point3[1]) +
							"z";

		this.pointer = paper.path(pointerString).attr({fill : this.pointerColor});
	}

	createSpinner = function(paper){
		var spinner = paper.circle(this.cx, this.cy, this.spinnerRadius).attr{fill:this.spinnerFillColor, stroke: this.spinnerStrokeColor};
	}

	setValue = function(data){
		if(data){

			this.value = 0;
			for (i=0; i < data.length(); i++){
				this.value += data[i];
			}
			this.value = this.value/data.length();
		}
		else
			this.value = this.defaultValue;
	}

	
	this.draw = function(data){
		var priorValue = this.value;
		setValue(data);
		var rotAngle = (this.value - priorValue) * 240 / this.range;
		var rotString = "r" + String(rotAngle) + "," + String(this.cx) + "," + String(this.cy);
		this.pointer.animate({transform : rotString, this.transDur});
	}
}
	

	// marker.attr("fill", "#FF4000");
	
	// var marker_circle = paper.circle(100, 100, 6);
	// marker_circle.attr("fill", "#FF4000");
	// marker_circle.attr("fill", "#FF4000");




	// function rotationstring(value, center_x,center_y){
	// 	var dm_ratio = 360.0/300.0; 
	// 	var rotation_value = value*dm_ratio;
	// 	var rotation_angle = String(rotation_value);
	// 	return "r" + rotation_angle + "," + String(center_x) + "," + String(center_y); 
	// 	}


	// marker.animate({transform:rotationstring(200, 100, 100)},3000);
	// 