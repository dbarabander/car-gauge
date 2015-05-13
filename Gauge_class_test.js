
function Gauge(){

	setAssumed = function(att, def){
		return typeof att !== 'undefined' ? att : def;
	}

	this.init = function(){
		this.setLocation();
		this.setTransDur();
		this.setExtrema();
		this.setDefault();
		this.setGaugeSettings();
		this.setTickerSettings();
		this.setSpinnerSettings();
		this.setPointerSettings();
		this.setValue();
	} 

	this.setLocation = function(size, startX, startY){
		this.size = setAssumed(size, 200);
		this.startX = setAssumed(startX, 0);
		this.startY = setAssumed(startY, 0);
		this.cx = this.startX + this.size / 2;
		this.cy = this.startY + this.size / 2;
	}

	this.setTransDur = function(duration){
		this.transDur = setAssumed(duration, 3000);
	}

	this.setExtrema = function(min,max){
		this.min = setAssumed(min, 0);
		this.max = setAssumed(max, 100);
		this.range = this.max - this.min;
	}

	this.setGaugeSettings = function(gaugeColor){
		this.gaugeColor = setAssumed(gaugeColor, "black");
		this.radius = this.size * 0.485;
		//Possibly add angle setter
	}

	this.setTickerSettings = function(majorTickers, minorPerMajor, tickerColor, majorTickerWidth, majorTickerLength, minorTickerWidth, minorTickerLength){
		this.majorTickers = setAssumed(majorTickers, 14);
		this.minorPerMajor = setAssumed(minorPerMajor, 1);
		this.tickerColor = setAssumed(tickerColor, "#00FA9A");
		this.majorTickerWidth = setAssumed(majorTickerWidth, this.size * .02);
		this.minorTickerWidth = setAssumed(minorTickerWidth, this.size * .02);
		this.majorTickerLength = setAssumed(majorTickerLength, this.size * .12);
		this.minorTickerLength = setAssumed(minorTickerLength, this.size * .07);
		this.totalTickers = this.majorTickers * (1 + this.minorPerMajor);
		this.tickersPerSect = 1 + this.minorPerMajor;
		this.tickerAngle = 240 / this.totalTickers;
		this.tickerRadius = this.radius * 0.7;
	}

	this.setSpinnerSettings = function(spinnerStrokeColor, spinnerFillColor, spinnerRadius){
		this.spinnerFillColor = setAssumed(spinnerFillColor, "black");
		this.spinnerStrokeColor = setAssumed(spinnerStrokeColor, "#00FA9A");
		this.spinnerRadius = setAssumed(spinnerRadius, this.size * 0.13);
	}

	this.setPointerSettings = function(pointerColor, pointerLength, pointerWidth){
		this.pointerColor = setAssumed(pointerColor, "#00FA9A");
		this.pointerLength = setAssumed(pointerLength, this.radius * 0.8);
		this.pointerWidth = setAssumed(pointerWidth, this.size * .1);
	}

	this.setTitle = function(title){
		this.title = title;
	}

	this.setDefault = function(defaultValue){
		this.defaultValue = setAssumed(defaultValue, this.min);
	}

	this.refreshDash = function(){
		this.paper.clear();
		this.createDash();
	}

	this.createCircle = function(paper){
		gaugeCircle = paper.circle(this.cx, this.cy, this.radius).attr("fill",this.gaugeColor);
	}

	this.createMinTickers = function(paper){
		for (i = -210; i <= 30; i+=this.tickerAngle){
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
			
			paper.path(pathString).attr("fill",this.tickerColor);
		}
	}

	this.CreateMajTickers = function(paper){
		for (i = -210; i <= 30; i+=this.tickerAngle * this.tickersPerSect){
			var radiusVector = [
					this.tickerRadius * math.cos(math.unit(i, 'deg')),
			 		this.tickerRadius * math.sin(math.unit(i, 'deg'))
			 	];
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
			
			paper.path(pathString).attr("fill",this.tickerColor);
		}
	}

	this.createPointer = function(paper){
		var defaultAngle = (this.defaultValue - this.min) * (240 / this.range) - 210;
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
							"L" + String(point2[0]) + "," + String(point2[1]) + "L" + String(point3[0]) + "," + String(point3[1]) +
							"z";

		this.pointer = paper.path(pointerString).attr("fill", this.pointerColor);
	}

	this.createSpinner = function(paper){
		var spinner = paper.circle(this.cx, this.cy, this.spinnerRadius).attr({fill : this.spinnerFillColor, stroke : this.spinnerStrokeColor});
	}

	this.createDash = function(){
		this.paper = Raphael(this.startX, this.startY, this.size, this.size);
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
			this.value = this.defaultValue;
	}

	
	this.draw = function(data){
		var priorValue = this.value;
		this.setValue(data);
		var rotAngle = (this.value - priorValue) * 240 / this.range;
		var rotString = "r" + String(rotAngle) + "," + String(this.cx) + "," + String(this.cy);
		this.pointer.animate({transform : rotString}, this.transDur);
	}

	this.init();
}
	

