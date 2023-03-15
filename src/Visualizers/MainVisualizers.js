import {animatePath, clearAnimationTimeouts} from "./AlgorithmsVisualizer";
import {animateWalls} from "./WallVisualizer";

export {animatePath, clearAnimationTimeouts, animateWalls};


export const setVisualizationState = (klass) => {
    klass.setState({isVisualizing: false});
};

