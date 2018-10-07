/**
 * Created by mpio on 27/02/2017.
 */
import React from 'react';
import {shallow} from 'enzyme';
import D3Chart from '../D3Chart';





describe('D3Chart container', ()=>{

   it('takes svg children and renders them on the svg', ()=>{
      const wrapper = shallow(
          <D3Chart>
             <rect width="200" height="100" fill="#CCB723" />
          </D3Chart>
      );

      expect(wrapper.find("rect").exists()).toBeTruthy()
   });

   it('takes multiple svg children and renders correctly', ()=>{
       const element1 = <rect width="200" height="200" fill="#22DD3D" />
           , element2 = <circle cx="100" cy="100" r="50" fill="#AB1133" />;
       const wrapper = shallow(
           <D3Chart>
               {element1}
               {element2}
           </D3Chart>
       );


       /*
       * commented as breaks with the responsive version - as it adjusts widths
       expect(wrapper.contains(
           <svg>
               <rect width="200" height="200" fill="#22DD3D" />
               <circle cx="100" cy="100" r="50" fill="#AB1133" />
           </svg>
       )).toBeTruthy()*/
       expect(wrapper.find('rect').exists()).toBeTruthy()
       expect(wrapper.find('circle').exists()).toBeTruthy()

   });
});

