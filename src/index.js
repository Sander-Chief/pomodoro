import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';

// global variable for audio
let sound;

// React component
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionTime: 25,
      breakTime: 5,
      currentTime: 1500,
      running: 'Session',
      paused: true,
      countDown: ''
    }
  }

  showTime = () => {
    let mins = Math.floor(this.state.currentTime / 60);
    let secs = this.state.currentTime - mins * 60;
    mins = mins < 10 ? '0' + mins : mins;
    secs = secs < 10 ? '0' + secs : secs;
    return mins + ':' + secs;
  }

  handleCountdown = () => {
    if (this.state.paused) {
      this.startCountdown();
      this.setState({
        paused: false
      });
    } else {
      this.state.countDown && clearInterval(this.state.countDown);
      this.setState({
        paused: true
      });
    };
  }

  timerSwitch = () => {
    this.state.running === 'Session' ? (
      this.setState({
        currentTime: this.state.breakTime * 60,
        running: 'Break'
      })
    ) : (
      this.setState({
        currentTime: this.state.sessionTime * 60,
        running: 'Session'
      })
    )
  }

  startCountdown = () => {
    this.setState({
      countDown: setInterval(() => {
        this.setState({
          currentTime: this.state.currentTime - 1
        });
        this.playSound();
        if (this.state.currentTime < 0) {
          this.state.countDown && clearInterval(this.state.countDown),
          this.timerSwitch(),
          this.startCountdown()
        };
      }, 1000),
    });
  }

  clearAll = () => {
    this.state.countDown && clearInterval(this.state.countDown);
    this.setState({
      sessionTime: 25,
      breakTime: 5,
      currentTime: 1500,
      running: 'Session',
      paused: true
    });
    sound = document.getElementById('beep');
    sound.currentTime = 0;
    sound.pause();
  }

  sessionChange = e => {
    this.lengthChange('sessionTime', e.target.getAttribute('value'), this.state.sessionTime, 'Session');
  }

  breakChange = e => {
    this.lengthChange('breakTime', e.target.getAttribute('value'), this.state.breakTime, 'Break');
  }

  lengthChange = (targetState, val, length, timerType) => {
    if (!this.state.paused) return;
    if (this.state.running != timerType) {
      if (val == '-' && length > 1) {
        this.setState({
          [targetState]: length - 1
        });
      } else if (val == '+' && length < 60) {
        this.setState({
          [targetState]: length + 1
        });
      };
    } else {
      if (val == '-' && length > 1) {
        this.setState({
          [targetState]: length - 1,
          currentTime: length * 60 - 60
        });
      } else if (val == '+' && length < 60) {
        this.setState({
          [targetState]: length + 1,
          currentTime: length * 60 + 60
        });
      }
    };
  }

  playSound = () => {
    if (this.state.currentTime === 0) {
    sound = document.getElementById('beep');
    sound.currentTime = 0;
    sound.play();
    };
  }

  render() {
    return(
      <div id='app'>
        <h1>Pomodoro Clock</h1>
        <div id='settings'>
          <div id='session-label'>
            <h3>Session Length</h3>
            <div className='timeControls'>
              <span>
                <i className="fas fa-arrow-down"
                   id='session-decrement'
                   value='-'
                   onClick={this.sessionChange}/>
              </span>
              <div id='session-length'>{this.state.sessionTime}</div>
              <span>
                <i className="fas fa-arrow-up"
                   id='session-increment'
                   value='+'
                   onClick={this.sessionChange}/>
              </span>
            </div>
          </div>
          <div id='break-label'>
            <h3>Break Length</h3>
            <div className='timeControls'>
              <span>
                <i className="fas fa-arrow-down"
                   id='break-decrement'
                   value='-'
                   onClick={this.breakChange}/>
              </span>
              <div id='break-length'>{this.state.breakTime}</div>
              <span>
                <i className="fas fa-arrow-up"
                   id='break-increment'
                   value='+'
                   onClick={this.breakChange}/>
              </span>
            </div>
          </div>
        </div>
        <div id='timer'>
          <div id='time-left'>
            <div id='timer-label'>
            {this.state.running}
              <audio
                id='beep'
                src='https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3'
                type='audio/mp3'
                preload='auto'
              />
            </div>
          {this.showTime()}
          </div>
        </div>
        <div id='controls'>
          <span id='start_stop' onClick={this.handleCountdown}>
            <i className="fas fa-play fa-2x"></i>
            <i className="fas fa-pause fa-2x"></i>
          </span>
          <span id='reset' onClick={this.clearAll}>
            <i className="fas fa-redo-alt fa-2x"></i>
          </span>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

module.hot.accept();