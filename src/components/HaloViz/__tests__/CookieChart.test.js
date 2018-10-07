/**
 * Created by mpio on 28/02/2017.
 */
import React from 'react';
import {shallow} from 'enzyme';
import CookieChart from '../CookieChart';

describe('Cookie chart', ()=>{
    it('Renders without crashing', ()=>{
        const onClickMock = ()=>{};
        const wrp = shallow(<CookieChart onClick={onClickMock}/>)

    })
});
