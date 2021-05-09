# create-global-state-selector

[![Publish Package](https://github.com/ashish-r/create-global-state-selector/actions/workflows/release-package.yml/badge.svg?branch=1.0.8)](https://github.com/ashish-r/create-global-state-selector/actions/workflows/release-package.yml)
[![codecov](https://codecov.io/gh/ashish-r/create-global-state-selector/branch/main/graph/badge.svg?token=P2QGFKODY7)](https://codecov.io/gh/ashish-r/create-global-state-selector)
[![DeepScan grade](https://deepscan.io/api/teams/10012/projects/17109/branches/380047/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=10012&pid=17109&bid=380047)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/ashish-r/create-global-state-selector/blob/master/LICENSE)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fashish-r%2Fcreate-global-state-selector.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fashish-r%2Fcreate-global-state-selector?ref=badge_shield)

# Welcome to StackEdit!
Create global state selectors from local redux slice selectors.
In `redux` each of the slices are autonomus and final store structure is defined by how the individual slices are merged with `combineReducers` .  `createGlobalStateSelector` takes local slice selectors and the slice structure to return global state selectors.

## Install

    npm i create-global-state-selector

## Uses
The example below uses `redux-toolkit` however you can use this with any standard Flux pattern that has multiple independent stores / slices, and are merged together with `combineReducers`.
    
    // personalDetailsSlice.js
    
    import { createSlice } from '@reduxjs/toolkit';
    
    const sliceKey = 'personalDetails';
    const initialState = {
      name: 'Ashish',
      age: '26',
      isEligibleToDrink: true,
    };

    const { actions, reducer } = createSlice({
      name: sliceKey,
      initialState,
      reducers: {
        setName(state, {payload}) {
          state.name = payload;
        },
        setAge(state, {payload}) {
          state.age = payload;
        },
        setIsEligibleToDrink(state) {
          state.isEligibleToDrink = selectLocalAge(state) >= 18;
        }
      },
    });
    
    export  default reducer;
    export const { increment, decrement } = actions;
    export sliceKey;
    export function selectLocalName(state) {
      return state.name;
    } 
    export function selectLocalAge(state) {
      return state.age;
    } 
    export function selectLocalIsEligibleToDrink(state) {
      return state.isEligibleToDrink;
    } 
    
---  
    // store.js
    
    import  { createStore, combineReducers } from 'redux';
    import personalDetailsReducer, { sliceKey as personalDetailsSliceKey } from personalDetailsSlice;
    
    const reducer =  combineReducers({
      [personalDetailsSliceKey]: personalDetailsReducer,
    });
    const store = createStore(reducer); 
    // { personalDetails : { name: 'Ashish', age: '26', isEligibleToDrink: true } }
    
    export default store;

---  
    // selectors.js
    import createGlobalStateSelector from 'create-global-state-selector';
    import { 
      sliceKey as personalDetailsSliceKey, 
      selectLocalName,
      selectLocalAge,
      selectLocalIsEligibleToDrink
    } from personalDetailsSlice;
     
    export const { 
      selectName,
      selectAge,
      selectIsEligibleToDrink
    } = createGlobalStateSelector(
      {
        selectName: selectLocalName,
        selectAge: selectLocalAge,
        selectIsEligibleToDrink: selectLocalIsEligibleToDrink,
      }, 
      personalDetailsSliceKey
    );
    
    // Global selectors created from local slice selectors
    // selectName({ personalDetails : { name: 'Ashish' } }) // 'Ashish'
    // selectAge({ personalDetails : { age: 26 } }) // 26
    
    

 


## API Examples (createGlobalStateSelector)
`createGlobalStateSelector` can accept both object of local slice selector functions or single local slice selector function .

### Pass an object of local slice selectors

    const { selectX, selectY, selectZ } = createGlobalStateSelector(
      {
        selectX: (state: Record<string, any>): number => state.x,
        selectY: (state: Record<string, any>): number => state.y,
        selectZ: (state: Record<string, any>): string => state.z,
      },
      'a',
      'b'
    );

    // Final store signature after combineReducers
    const  store = { a: { b: { x:  55, y:  65, z:  'temp' } } };
    
    selectX(store) // 55
    selectY(store) // 65
    selectZ(store) // 'temp'

### Pass a local slice selector

    const selectZ = createGlobalStateSelector(
      (state: Record<string, any>): number => state.z,
      'a',
      'b'
    );

    // Final store signature after combineReducers
    const  store = { a: { b: { x:  55, y:  65, z:  'temp' } } };
    
    selectZ(store) // 'temp'

## License

MIT
