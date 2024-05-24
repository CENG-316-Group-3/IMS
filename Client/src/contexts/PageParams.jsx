import React, { createContext, useContext, useState } from 'react';

const PageParamsContext = createContext(null);

export const usePageParams = () => useContext(PageParamsContext);

export const PageParamsProvider = ({ children }) => {
    const [params, setParams] = useState([]);

    const updateParams = (newParam) => {
        setParams(prevParams => {
            const index = prevParams.findIndex(p => p.name === newParam.name);
            if (index > -1) {
                // Update if there is already exits
                return [
                    ...prevParams.slice(0, index),
                    newParam,
                    ...prevParams.slice(index + 1)
                ];
            }
            // Add new one
            return [...prevParams, newParam];
        });
    };

    const deleteParams = (name) => {
        let i = 0;
        for (param of params){
            if (param.name === name){
                const temp = [... params];
                temp.pop(i);
                setParams(temp);
                return true;
            }
            i += 1;
        }
        return false;

    };

    const clearParams = () => {
        setParams([]);
    };

    const getParamByName = (name) => {
        return params.find(p => p.name === name) || null;
    };

    return (
        <PageParamsContext.Provider value={{ params, updateParams, deleteParams, clearParams, getParamByName }}>
            {children}
        </PageParamsContext.Provider>
    );
};
