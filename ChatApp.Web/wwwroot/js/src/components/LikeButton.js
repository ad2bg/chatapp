'use strict';

const e = React.createElement;

export default class LikeButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = { liked: false };
    }

    render() {
        if (this.state.liked) {
            return 'You liked this.';
        }

        // Without JSX
        //return e(
        //    'button',
        //    { onClick: () => this.setState({ liked: true }) },
        //    'Like'
        //);

        // Using JSX
        return (
            <button onClick={() => this.setState({ liked: true })}>
                Like
            </button>
        );
    }
}

//ReactDOM.render(e(LikeButton), domContainer);
