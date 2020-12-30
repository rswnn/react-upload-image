import logo from './logo.svg';
import './App.css';
import ScreenShoot from './component/Screenshoot'

function App() {
  return (
    <div className="App">
      <ScreenShoot selectClass="content" selectID="content" />
      <div className="content" id="content" style={ {
        backgroundColor: 'white'
      } }>
        <h1 style={ { color: 'black' } }>Nyoba Screenshoot</h1>
        <h3 color="green">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </h3>
        <p style={ { color: 'magenta' } }>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <p>John doe</p>
        <p style={ { color: 'green' } }>Jakarta</p>
        <p>GABE</p>
        <p style={ { color: 'blue' } }>YUHU</p>
        <p>WEALET</p>
        <p style={ { color: 'yellow' } }>REBELWORKS</p>
        <br />

      </div>
    </div>
  );
}

export default App;
