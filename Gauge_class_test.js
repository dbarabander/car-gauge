
		function Gauge(){



			this.configure = function(configuration){
			//FIXME
			}


			setAssumed = function(att, def){
				this.att = typeof att !== 'undefined' ? att : def;
			}

			this.setLocation = function(size, startX, startY){
				setAssumed(startX, 0);
				setAssumed(startY, 0);
				setAssumed(size, 100);
				this.cx = startX + size / 2;
				this.cy = startY + size / 2;
				this.radius = size * 0.485;
			}

			this.setExtrema = function(min,max){
				setAssumed(min, 0);
				setAssumed(max, 100);
				this.range = max - min;
			}

			this.setTickerSettings = function(majorTicker, minorPerMajor, tickerColor, 
										      majorTickerWidth, majorTickerLength, 
										      minorTickerWidth, minorTickerLength){
				baseSize = this.size * 2 / 100;
				baseMajLength = this.size * 21 / 100;
				baseMinLength = this.size * 7 / 100;
				setAssumed(majorTicker, 15);
				setAssumed(minorPerMajor, 1);
				setAssumed(tickerColor, "#00FA9A");
				setAssumed(majorTickerWidth, baseSize);
				setAssumed(minorTickerWidth, baseSize);
				setAssumed(majorTickerLength, baseMajLength);
				setAssumed(minorTickerWidth, baseMinLength);
				this.totalTickers = this.majorTicker + this.majorTicker * this.minorPerMajor - 1;
				this.tickersPerSect = this.majorTicker + this.minorPerMajor;
				this.tickerAngle = 240/totalTickers;
				this.tickerRadius = this.radius * 0.9;
			}

			this.setGaugeColor = function(gaugeColor){
				setAssumed(gaugeColor, "black");
			}

			this.setSpinnerColor = function(spinnerStrokeColor,spinnerFillColor){
				setAssumed(spinnerFillColor, "black");
				setAssumed(spinnerStrokeColor, "#00FA9A");
			}

			this.setPointerColor = function(pointerColor){
				setAssumed(pointerColor, "#00FA9A");
			}

			this.setTitle = function(title){
				this.title = title;
			}

			this.setDefault = function(defaultValue){
				setAssumed(defaultValue, 0);
			}

			this.createDash = function(){
				var paper = Raphael(this.startX, this.startY, this.size, this.size);
				createCircle(paper);
				createMinTickers(paper);
				CreateMajTickers(paper);
				createPointer(paper);
				createSpinner(paper);
			}

			createCircle = function(paper){
				var gaugeCircle = paper.circle(this.cx, this.cy, this.radius).attr("fill" : this.gaugeColor );
			}



			createMinTickers = function(paper){
 
				for (i = -30; i <= 210; i+=this.tickerAngle){
					var radiusVector = [this.tickerRadius * cos(i), this.tickerRadius * sin(i)];
					var unitRadiusVector = [cos(i), sin(i)];

					var point0 = [this.cx + radiusVector[0], this.cy + radiusVector[1]];
					
					var point1 = 
						[
						point1[0] - (this.minorTickerWidth / 2) * unitRadiusVector[1], 
						point1[1] + (this.minorTickerWidth / 2) * unitRadiusVector[0]
						];

					var point2 = 
						[
						point2[0] + this.minorTickerLength * unitRadiusVector[0]
						point2[1] + this.minorTickerLength * unitRadiusVector[1]
						];

					var point3 =
						[
						point3[0] + this.minorTickerWidth * unitRadiusVector[1],
						point3[1] - this.minorTickerWidth * unitRadiusVector[0]
						];

					var point4 = 
						[
						point4[0] - this.minorTickerLength * unitRadiusVector[0],
						point4[1] - this.minorTickerLength * unitRadiusVector[1]
						];
					var pathString = "M" + String(point0[0]) + "," + String(point0[1]) + "L" + String(point1[0]) + "," + String(point1[1]) + 
									 "L" + String(point2[0]) + "," + String(point2[1]) + "L" + String(point3[0]) + "," + String(point3[1]) +
								 	 "L" + String(point4[0]) + "," + String(point4[1]) + " z";
					
					paper.path(pathString);
				}
			}

			createMajTickers = function(paper){
				for (i = -30; i <= 210; i+=this.tickerAngle*this.tickersPerSect){
					var radiusVector = [this.tickerRadius * cos(i), this.tickerRadius * sin(i)];
					var unitRadiusVector = [cos(i), sin(i)];

					var point0 = [this.cx + radiusVector[0], this.cy + radiusVector[1]];
					
					var point1 = 
						[
						point1[0] - (this.majorTickerWidth / 2) * unitRadiusVector[1], 
						point1[1] + (this.majorTickerWidth / 2) * unitRadiusVector[0]
						];

					var point2 = 
						[
						point2[0] + this.majorTickerLength * unitRadiusVector[0]
						point2[1] + this.majorTickerLength * unitRadiusVector[1]
						];

					var point3 =
						[
						point3[0] + this.majorTickerWidth * unitRadiusVector[1],
						point3[1] - this.majorTickerWidth * unitRadiusVector[0]
						];

					var point4 = 
						[
						point4[0] - this.majorTickerLength * unitRadiusVector[0],
						point4[1] - this.majorTickerLength * unitRadiusVector[1]
						];
					var pathString = "M" + String(point0[0]) + "," + String(point0[1]) + "L" + String(point1[0]) + "," + String(point1[1]) + 
								 	 "L" + String(point2[0]) + "," + String(point2[1]) + "L" + String(point3[0]) + "," + String(point3[1]) +
								 	 "L" + String(point4[0]) + "," + String(point4[1]) + " z";
					
					paper.path(pathString);
				}
			}

			createPointer = function(paper){
			// finish later
			createSpinner = function(paper){
				var spinner = paper.circle(this.cx, this.cy, this.size*15/100).attr{fill:this.spinnerFillColor, stroke: this.spinnerStrokeColor};
				}
			}

			this.setValue = function(data){
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

			
			this.draw() = function(data){
				if(!this.currentState){
					this.currentState = this.defaultValue;
				}

				this.setValue(data);


				var dmRatio = 240/this.range;
				var rotationValue = dmRatio*(this.value - this.currentState);
				var rotationString = "r" + String(rotationValue) + "," + String(this.data.config.cx) + "," + String(this.data.config.cy);

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