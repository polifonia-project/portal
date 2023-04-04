import React from "react";
import classes from "./LoaderResultLine.module.css";

function LoaderResultLine() {

  return (
    <div>
        <div className={classes.resultLine}>
            <div className={classes.resultNum}><button className={classes.loaderResult}></button></div>
            <div className={classes.scrollResult}>
            <div className={classes.resultCat}><span className={classes.categoryResult}>Category</span></div>
            <div className={classes.resultLabel}><span className={classes.loaderResult}><b>Label of Result is loading</b></span></div>
            <div className={classes.resultRel}><span className={classes.loaderResult}>Label of Result is loading</span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span className={classes.loaderResult}>Relation is loading</span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span className={classes.loaderResult}>Label of Result is loading</span></div>
            </div>
            <div className={classes.resultActions}><button className={classes.categoryResult}></button></div>
        </div>
        <div className={classes.resultLine}>
            <div className={classes.resultNum}><button className={classes.loaderResult}></button></div>
            <div className={classes.scrollResult}>
            <div className={classes.resultCat}><span className={classes.categoryResult}>Category</span></div>
            <div className={classes.resultLabel}><span className={classes.loaderResult}><b>Label of Result is loading</b></span></div>
            <div className={classes.resultRel}><span className={classes.loaderResult}>Label of Result is loading</span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span className={classes.loaderResult}>Relation is loading</span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span className={classes.loaderResult}>Label of Result is loading</span></div>
            </div>
            <div className={classes.resultActions}><button className={classes.categoryResult}></button></div>
        </div>
        <div className={classes.resultLine}>
            <div className={classes.resultNum}><button className={classes.loaderResult}></button></div>
            <div className={classes.scrollResult}>
            <div className={classes.resultCat}><span className={classes.categoryResult}>Category</span></div>
            <div className={classes.resultLabel}><span className={classes.loaderResult}><b>Label of Result is loading</b></span></div>
            <div className={classes.resultRel}><span className={classes.loaderResult}>Label of Result is loading</span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span className={classes.loaderResult}>Relation is loading</span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span className={classes.loaderResult}>Label of Result is loading</span></div>
            </div>
            <div className={classes.resultActions}><button className={classes.categoryResult}></button></div>
        </div>
        <div className={classes.resultLine}>
            <div className={classes.resultNum}><button className={classes.loaderResult}></button></div>
            <div className={classes.scrollResult}>
            <div className={classes.resultCat}><span className={classes.categoryResult}>Category</span></div>
            <div className={classes.resultLabel}><span className={classes.loaderResult}><b>Label of Result is loading</b></span></div>
            <div className={classes.resultRel}><span className={classes.loaderResult}>Label of Result is loading</span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span className={classes.loaderResult}>Relation is loading</span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span className={classes.loaderResult}>Label of Result is loading</span></div>
            </div>
            <div className={classes.resultActions}><button className={classes.categoryResult}></button></div>
        </div>
    </div>
  )
}

export default LoaderResultLine;
