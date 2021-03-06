'use strict'

class Display extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			offset: { x: 0, y: 0 }
		};
	}

	componentDidMount() {
		this.pt = this.svg.createSVGPoint();
	}

	getStroke = (obj) => {
		if(this.props.selection == null) {
			return "black";
		}
		if(this.props.selection == obj ||
			(obj.lineId != null && obj.endpoint != null && this.props.selection.lineId == obj.lineId && this.props.selection.endpoint == obj.endpoint)) {
			return "blue";
		}
		return "black";
	}

	pathPos = () => {
		if(this.props.path != null) {
			var pos = this.props.path.getPos(this.props.env.time);
			return <circle cx={pos.x} cy={pos.y} r="5" fill="black" />
		}
		return null;
	}

	drawPath = () => {
		var lines = [];
		if(this.props.showPath && this.props.path != null) {
			var segments = this.props.path.getSegments();
			for(var i = 0; i < segments.size(); i++) {
				lines.push(<line key={i} x1={segments.get(i).getStart().x} y1={segments.get(i).getStart().y} x2={segments.get(i).getEnd().x} y2={segments.get(i).getEnd().y} stroke="#6699ff"/>);
			}
		}
		return lines;
	}

	wallSelectCircles = (wall) => {
		if(this.props.mode == "edit") { return (
				<React.Fragment>
					<circle cx={wall.point1.x + this.props.env.time * wall.point1.vx}
						cy={wall.point1.y + this.props.env.time * wall.point1.vy}
						r="5" stroke={ this.getStroke({ lineId: wall.id, endpoint: "point1" }) } strokeWidth="2" fillOpacity="0"
						onMouseDown={ this.mouseDown({ lineId: wall.id, endpoint: "point1" }) } onMouseUp={ this.mouseUp }
						onClick={ this.mouseClick({ lineId: wall.id, endpoint: "point1"}) }/>
					<circle cx={wall.point2.x + this.props.env.time * wall.point2.vx}
						cy={wall.point2.y + this.props.env.time * wall.point2.vy}
						r="5" stroke={ this.getStroke({ lineId: wall.id, endpoint: "point2" }) } strokeWidth="2" fillOpacity="0"
						onMouseDown={ this.mouseDown({ lineId: wall.id, endpoint: "point2" }) } onMouseUp={ this.mouseUp }
						onClick={ this.mouseClick({ lineId: wall.id, endpoint: "point2"}) }/>
				</React.Fragment>
			);
		}
	}

	mouseDown = (point) => {
		return () => this.props.onMouseDown(point);
	}

	mouseUp = () => {
		this.props.onMouseUp();
	}

	cursorPos = (ev) => {
		this.pt.x = ev.clientX;
		this.pt.y = ev.clientY;
		
		// The cursor point, translated into svg coordinates
		return  this.pt.matrixTransform(this.svg.getScreenCTM().inverse());
	}

	mouseMove = (ev) => {
		this.props.onMouseMove(this.cursorPos(ev));
	}

	mouseClick = (point) => {
		return () => this.props.onMouseClick(point);
	}

	wallStart = (ev) => {
		this.props.wallStart(this.cursorPos(ev));
	}

	wallEnd = (ev) => {
		this.props.wallEnd(this.cursorPos(ev));
	}

	panStart = (ev) => {
		this.panOrigin = {};
		this.panOrigin.x = ev.clientX;
		this.panOrigin.y = ev.clientY;
		this.startingOffset = this.state.offset;
	}

	panEnd = () => {
		this.panOrigin = null;
	}

	panMove = (ev) => {
		if(this.panOrigin == null) return;
		var dx = ev.clientX - this.panOrigin.x;
		var dy = ev.clientY - this.panOrigin.y;

		var offset = {};
		offset.x = this.startingOffset.x - dx;
		offset.y = this.startingOffset.y - dy;

		this.setState({ offset });
	}

	getViewBox = () => {
		return this.state.offset.x + " " + this.state.offset.y + " 1080 600";
	}

	renderEnv = () => {
		return (
			<React.Fragment>
				<circle cx={this.props.env.start.x} cy={this.props.env.start.y} r="10" stroke={this.getStroke("start")} strokeWidth="2" fill="green"
			 		onMouseDown={ this.mouseDown("start") } onMouseUp={ this.mouseUp } onClick={ this.mouseClick("start") } />
				<circle cx={this.props.env.end.x} cy={this.props.env.end.y} r="10" stroke={this.getStroke("end")} strokeWidth="2" fill="red"
			 		onMouseDown={ this.mouseDown("end") } onMouseUp={ this.mouseUp } onClick={ this.mouseClick("end") }/>
			 	{ this.props.env.walls.map(wall => (
					<React.Fragment key={wall.id} >
						<line x1={wall.point1.x + this.props.env.time * wall.point1.vx}
							y1={wall.point1.y + this.props.env.time * wall.point1.vy}
							x2={wall.point2.x + this.props.env.time * wall.point2.vx}
							y2={wall.point2.y + this.props.env.time * wall.point2.vy}
							stroke="black" strokeWidth="2"/>
						{ this.wallSelectCircles(wall) }
					</React.Fragment>
				)) }
				{ this.drawPath() }
			 	{ this.pathPos() }
			</React.Fragment>
		);
	}

	render() {
		if(this.props.mode == "draw-wall") {
			return (
				<svg id="display" width="1080" height="600" viewBox={ this.getViewBox() } style={{ border: '3px solid #000000' }} ref={(ref) => this.svg = ref}
					onMouseMove={ this.mouseMove } onMouseDown={ this.wallStart } onMouseUp={ this.wallEnd }>
					{ this.renderEnv() }
				</svg>
			);

		}
		if(this.props.mode == "pan") {
			return (
				<svg id="display" width="1080" height="600" viewBox={ this.getViewBox() } style={{ border: '3px solid #000000', cursor: "move" }} ref={(ref) => this.svg = ref}
					onMouseMove={ this.panMove } onMouseDown={ this.panStart } onMouseUp={ this.panEnd }>
					{ this.renderEnv() }
				</svg>
			);
		}
		return (
			<svg id="display" width="1080" height="600" viewBox={ this.getViewBox() } style={{ border: '3px solid #000000' }} ref={(ref) => this.svg = ref} onMouseMove={ this.mouseMove }>
				{ this.renderEnv() }
			</svg>
		);
	}

}
