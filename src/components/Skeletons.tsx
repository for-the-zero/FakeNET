import { Skeleton, SkeletonItem } from "@fluentui/react-components";

export function Skeletons({isSingleLine = false}: {isSingleLine?: boolean}){

    if(isSingleLine){
        return (<div style={{
            display: "flex",
            justifyContent: "flex",
            flexDirection: "row"
        }}>
            {Array.from({length: 1 + Math.floor(Math.random() * 4)}, (_, i)=>{
                return (<SkeletonItem style={{width: `${5 + Math.random() * 35}%`, display: "inline-block", marginRight: '20px', marginBottom: '10px'}} />);
            }) }
        </div>);
    } else {
        return (<div style={{
            display: "flex",
            justifyContent: "flex",
            flexDirection: "column"
        }}>
            {Array.from({length: 10 + Math.floor(Math.random() * 20)}, (_, i)=>{
                return (<Skeletons isSingleLine={true} />);
            }) }
        </div>);
    };
};