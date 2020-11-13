const eobjectM = require("./objects")

const game =
{
    fps:0,
    current:
    {
        level:0,
        screen:"dummy",
        updateFunc:function(){},
        eobjects:[new eobjectM.main(0,0,0,0,"dummy",null),new eobjectM.temp()]
    },
    old:
    {
        level:0,
        screen:"dummy",
        updateFunc:function(){},
        eobjects:[new eobjectM.main(0,0,0,0,"dummy",null),new eobjectM.temp()]
    }
}

module.exports =
{
    main:game
}
util.print("info","Initialized Game Module")