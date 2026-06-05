


//ema with smoothening 
export function EMA(cur:number,prev:number,alpha=0.2){
    return alpha * cur + (1 - alpha) * prev;
}

// calculate magnitude
function calculateMagnitude(x:number,y:number,z:number):number{
    return Math.sqrt((x*x)+(y*y)+(z*z))
}

export interface IDeviceTelemetryData {
  acceleration: {
    timestamp: number;
    x: number;
    y: number;
    z: number;
  };
  accelerationIncludingGravity: {
    timestamp: number;
    x: number;
    y: number;
    z: number;
  };
  interval: number;
  orientation: number;
  rotation: {
    alpha: number;
    beta: number;
    gamma: number;
    timestamp: number;
  };
  rotationRate: {
    alpha: number;
    beta: number;
    gamma: number;
    timestamp: number;
  };
}







// 20 reading to make sure harshBreakingEvent happens
export function harshBreakingEventDetection(buffer:IDeviceTelemetryData[]){
    if(buffer.length<20){
        return false;
    }
    //extracting last five values
    //this will be 2 seconds
    const values = buffer.slice(-20);
    // values i need
    //acceleration -> x,y,z,timestamp
    //rotation rate -> alpha, beta, gamma 
    let count = 0;
    for(let data of values){
        let forwardAcceleration = data.acceleration.y;
        let rotationRateBeta = Math.abs(data.rotationRate.beta);
        if(forwardAcceleration < -3 && rotationRateBeta <0.4){
            count+=1
        }
    }
    if(count>=20){
        return true;
    }
    return false;
}

// last 20 reading so 2 sec 
// 10 values per second so 1 value per 100ms
export function harshAccelerationEvent(buffer:IDeviceTelemetryData[]){
    const values = buffer.slice(-20);
    let count = 0;
    for(let data of values){
        let x = data.acceleration.x;
        let y = data.acceleration.y;
        let z =data.acceleration.z;
        let magnitude = calculateMagnitude(x,y,z);
        if(magnitude > 5){
            count+=1;
        }
    }
    if(count >= 5){
        return true;
    }
    return false;
}

// rotation rate gamma for last 20 values
export function sharpTurnEvent(buffer:IDeviceTelemetryData[]){
    if(buffer.length < 30){
        return false;
    }
    let values = buffer.slice(-30);

    let count = 0;
    for(let data of values){
        let rotationRateGamma = Math.abs(data.rotationRate.gamma);
        if(rotationRateGamma >= 4.0){
            count+=1;
        }
    }
    if(count >=30){
        return true;
    }
    return false;
}


// last 3 values of rotationRate gamma threshold is 2.5
export function aggressiveSteeringMovementEvent(buffer:IDeviceTelemetryData[]){
    if(buffer.length < 30){
        return false;
    }
    let values = buffer.slice(-30)

    let count = 0;
    for(let data of values){
        let rotationRateGamma = Math.abs(data.rotationRate.gamma);
        if(rotationRateGamma >= 4.0){
            count+=1;
        }
    }
    if(count >=30){
        return true;
    }
    return false;
}



// 10 values
// acceleration x,y,z -> 2
// rotation rate alpha,beta,gamma -> 1.5
export function excessiveDeviceMovementEvent(buffer:IDeviceTelemetryData[]){
    if(buffer.length<40){
        return false;
    }
    let values = buffer.slice(-40);

    let count = 0;
    for(let data of values){
        let x = data.acceleration.x;
        let y =data.acceleration.y;
        let z = data.acceleration.z;
        let alpha = Math.abs(data.rotationRate.alpha);
        let beta = Math.abs(data.rotationRate.beta);
        let gamma = Math.abs(data.rotationRate.gamma);

        if(x >= 4 && y >=4 && z >=4 && alpha >=3 && beta >= 3 && gamma >= 3){
            count +=1 ;
        }
    }
    if(count >= 40){
        return true;
    }
    return false;

}


// 10 values
// acceleration -> x,y,z abs -> >=1.5 m/s^2
// rotationRate -> alpha,beta,gamma -> 1.5 rad
export function phoneUseDuringDrivingEvent(buffer:IDeviceTelemetryData[]){
     if(buffer.length<40){
        return false;
    }
    let values = buffer.slice(-40);

    let count = 0;
    for(let data of values){
        let x = Math.abs(data.acceleration.x);
        let y = Math.abs(data.acceleration.y);
        let z = Math.abs(data.acceleration.z);
        let alpha = Math.abs(data.rotationRate.alpha);
        let beta = Math.abs(data.rotationRate.beta);
        let gamma = Math.abs(data.rotationRate.gamma);

        if(x >= 4 && y >= 4 && z >= 4 && alpha >=3 && beta >= 3 && gamma >= 3){
            count +=1 ;
        }
    }
    if(count >= 40){
        return true;
    }
    return false;
}
