import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Measure from 'react-measure'
import ThreedyContext from '../../Contexts/ThreedyContext';
import { animate, motion, useMotionValue } from "framer-motion"

import styles from './styles';

import getDimensions from './utils';

const I3 = ({ config }) => {

    const context = useContext(ThreedyContext);

    const [dimensions, setDimensions] = useState(undefined);

    const ha_config = context.config;
    const hass = context.hass;

    const progress = hass.states[`${ha_config.base_entity}_job_percentage`].state / 100;

    const x = useMotionValue(0);

    const calcDimensions = (rect) => {

        const dimensions = getDimensions(
            config,
            rect.bounds,
            ha_config.scale || 1.0
        )

        setDimensions(dimensions);
    }


    useEffect(() => {
        
        if (dimensions !== undefined) { 
            return animate(x, dimensions.BuildPlate.width, {
                duration: 2,
                repeat: 'Infinity',
                repeatType: 'reverse',
                ease: 'linear'
            })
        }

    }, [dimensions])


    return (
        <Measure
            bounds
            onResize={calcDimensions}
        >

            {
                ({ measureRef }) => (
                    <div style={{ ...styles.I3 }} ref={measureRef}>

                        {

                            dimensions !== undefined ? (
                                <div style={{ ...styles.Scalable, ...dimensions.Scalable }}>

                                    <div style={{ ...styles.Frame, ...dimensions.Frame }}>
                                        <div style={{ ...styles.Hole, ...dimensions.Hole }} />
                                    </div>

                                    <div style={{ ...styles.BuildArea, ...dimensions.BuildArea }}>
                                        <div
                                            style={{ ...styles.Print, height: `${progress * 100}%` }}
                                        />
                                    </div>

                                    <div style={{ ...styles.BuildPlate, ...dimensions.BuildPlate }} />

                                    <motion.div
                                        animate={{
                                            y: progress * -1 * dimensions.BuildArea.height
                                        }}
                                        style={{
                                            ...styles.XAxis,
                                            ...dimensions.XAxis
                                        }}
                                    />

                                    <motion.div
                                        animate={{
                                            y: progress * -1 * dimensions.BuildArea.height
                                        }}
                                        style={{
                                            x,
                                            ...styles.Gantry,
                                            ...dimensions.Gantry
                                        }}
                                    >
                                        <div className="Nozzle"
                                            style={{
                                                ...styles.Nozzle,
                                                ...dimensions.Nozzle
                                            }}
                                        >

                                        </div>
                                    </motion.div>
                                </div>
                            ) : null

                        }

                    </div>
                )
            }
        </Measure>
    )

}

export default I3;