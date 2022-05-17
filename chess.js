
/*

Written by Christian FRANCK

(c) University of Luxembourg 2021


The chess pieces used in this project are transformed versions of the models found here:
https://www.thingiverse.com/thing:40605
distributed under the creative commons CC BY-SA 3.0 license.

This file uses code from the SPS tree generator found here:
https://github.com/BabylonJS/Extensions
distributed under tha Apache 2.0 license

The texture of the tree has been downloaded from
https://commons.wikimedia.org/wiki/File:Bark_texture_wood.jpg
and is in the public domain.
 */


var canvas = document.getElementById("renderCanvas");

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function ()
{
    return new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false});
};

var camera;

var startingPoint;
var currentMesh;
var ground;

var leafcolor;

const meshes_pieces = new Map();

var pieces=[];

var gameover=0;
var cameraspin=0.0003;

var skybox;


var computerMoveInProgress=false;
var humanMoveInProgress=false;
var whiteToMove=false;
var movCntLimitWhite=100;
var movCntLimitBlack=100;
var startingPosition;
var groundsize=500;

function shuffle(array)
{
    return array.sort( ()=>Math.random()-0.5 );
}

// var A=[ 'X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X',
//         'X',' ',' ',' ',' ',' ',' ','R',' ',' ',' ',' ',' ',' ',' ','X',' ',' ','X',' ',' ',' ','X',' ','X',
//         'X',' ',' ','X',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','X',' ',' ','X',' ',' ',' ','X','K','X',
//         'X',' ',' ','X',' ',' ',' ','X','X','N',' ','X',' ',' ',' ','X',' ','R','X',' ',' ',' ','X',' ','X',
//         'X',' ',' ','P',' ','N',' ',' ',' ',' ',' ',' ','P',' ',' ','X','P',' ','X',' ','P',' ','X',' ','X',
//         'X',' ',' ','R','N',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','X','P',' ','X',' ','R','B','X',' ','X',
//         'X','X','X','X','X','X','X',' ',' ','X',' ',' ','X',' ',' ','X','P','P',' ',' ',' ',' ',' ',' ','X',
//         'X',' ',' ',' ',' ',' ','B',' ',' ','X',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','X',
//         'X',' ',' ',' ',' ',' ',' ',' ',' ','X',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','P',' ',' ',' ','X',
//         'X',' ',' ',' ',' ','X',' ',' ',' ','X',' ',' ','X','X','P',' ','P',' ',' ','P','P',' ',' ','P','X',
//         'X',' ','X',' ',' ',' ',' ','N',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','X','X','X','X',' ','X',
//         'X',' ',' ',' ','n',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','X',
//         'X',' ',' ',' ',' ',' ',' ','X',' ',' ',' ',' ','X',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','X',
//         'X','X',' ',' ','B',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','X','X',' ',' ',' ',' ','X',
//         'X','X',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','p',' ',' ','X','X',
//         'X','X',' ','q','X',' ',' ','X','X',' ',' ',' ',' ','X','X','X',' ',' ',' ',' ',' ',' ',' ','X','X',
//         'X','X',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','X',' ',' ',' ',' ','X','X',
//         'X','X',' ','r',' ',' ',' ',' ',' ','p',' ',' ',' ',' ',' ',' ',' ','p',' ',' ',' ',' ','p',' ','X',
//         'X','X','n',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','p','k',' ',' ',' ',' ',' ',' ',' ',' ','X',
//         'X',' ','n',' ','X','Q',' ','X','X',' ',' ',' ',' ',' ',' ',' ','X','p',' ','X',' ',' ',' ',' ','X',
//         'X',' ',' ',' ','X',' ',' ',' ',' ',' ',' ','X',' ',' ',' ',' ','X','p',' ','X',' ',' ','X','X','X',
//         'X',' ',' ',' ','X',' ',' ',' ',' ',' ',' ','X',' ',' ',' ',' ','X',' ','b',' ',' ',' ',' ',' ','X',
//         'X',' ',' ',' ','X',' ','b','X',' ',' ',' ',' ','b',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','X',
//         'X','X',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','r',' ',' ',' ','X',' ',' ','X',
//         'X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X'];

// var A=['X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X',
//     'X',' ',' ',' ',' ',' ',' ',' ','X',' ',' ',' ',' ','X',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','X',
//     'X','X',' ',' ',' ','X',' ',' ','r','q',' ',' ',' ','X',' ',' ',' ',' ','X','X','X','X','X','X','X',
//     'X',' ',' ',' ','r','X',' ','b',' ',' ',' ',' ',' ','X',' ',' ',' ','n',' ',' ','n',' ','r',' ','X',
//     'X',' ','p',' ',' ','X',' ','n','X','X','X',' ',' ','X','p',' ',' ',' ',' ',' ','b',' ',' ','p','X',
//     'X','X','X',' ','n','X','p',' ',' ','p','p',' ',' ','X',' ',' ','X','k',' ','X','b',' ','X',' ','X',
//     'X',' ','p','p','p','X',' ',' ',' ',' ',' ',' ','p',' ','p',' ',' ','p',' ','X',' ',' ',' ','p','X',
//     'X',' ',' ',' ','b','X','r',' ',' ',' ','p',' ',' ',' ',' ',' ',' ',' ',' ','X',' ','p',' ',' ','X',
//     'X',' ','X',' ',' ',' ',' ',' ','X',' ',' ',' ','X',' ','p','X',' ',' ',' ','X',' ',' ',' ','X','X',
//     'X',' ','X',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','X',' ',' ',' ','X',' ',' ',' ',' ','X',
//     'X',' ','X',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','X',' ',' ',' ','X',' ',' ',' ',' ','X',
//     'X',' ','X',' ',' ',' ','X',' ',' ','X',' ',' ',' ',' ',' ','X',' ',' ',' ',' ',' ',' ',' ','X','X',
//     'X',' ',' ',' ',' ',' ','X',' ',' ',' ',' ',' ','X',' ',' ','X',' ',' ',' ',' ',' ',' ',' ',' ','X',
//     'X',' ',' ',' ',' ',' ','X',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','X',' ',' ',' ',' ',' ','X',
//     'X',' ',' ','X',' ',' ','X',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','X','X','X','X',
//     'X',' ',' ','X',' ','P',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','P',' ',' ','X',
//     'X',' ','P','X',' ',' ',' ',' ',' ',' ','P',' ',' ',' ',' ',' ',' ',' ',' ',' ','P',' ','P',' ','X',
//     'X','P',' ','X',' ',' ',' ',' ',' ','X',' ',' ','X','X','X','X','X',' ','P',' ',' ',' ','B',' ','X',
//     'X',' ',' ','R','N',' ','X',' ',' ','X',' ',' ',' ',' ',' ','B',' ',' ',' ',' ',' ',' ','P','X','X',
//     'X',' ',' ','P',' ',' ','P',' ',' ',' ','P','P',' ','P',' ',' ',' ','B',' ',' ','X','Q','R',' ','X',
//     'X','X',' ','N',' ',' ',' ','P',' ',' ',' ',' ',' ',' ','P',' ',' ','N',' ',' ',' ',' ',' ',' ','X',
//     'X','X',' ',' ',' ',' ',' ',' ',' ',' ','K',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','X',
//     'X','X',' ','R','R','X','X','X','X','X','B',' ',' ','N','X',' ',' ',' ',' ','X','X','X','X','X','X',
//     'X','X',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','X',
//     'X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X'];

var A=['X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X',
    'X','X',' ',' ',' ',' ',' ',' ',' ',' ',' ','X','X','X','X','X','X',' ',' ',' ',' ',' ',' ','X','X',
    'X',' ',' ',' ','r','k','X',' ',' ','r',' ','n',' ',' ',' ',' ',' ','b',' ','n','X',' ',' ',' ','X',
    'X',' ',' ',' ',' ',' ','X',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','q',' ',' ',' ',' ','X',
    'X',' ','p',' ',' ',' ','X','p',' ',' ',' ',' ',' ',' ',' ','X',' ',' ','b','p',' ',' ','p','p','X',
    'X','b',' ','p',' ',' ','X',' ',' ','n',' ',' ','r','n',' ','X',' ',' ','n','r',' ','p',' ',' ','X',
    'X','X',' ','r',' ','b','X','b',' ',' ',' ',' ','X',' ',' ',' ',' ',' ','X',' ',' ',' ','X','X','X',
    'X','X','p',' ',' ',' ',' ',' ',' ','b',' ','p','X','n',' ',' ','p','p',' ',' ',' ',' ','r',' ','X',
    'X','X','p',' ',' ',' ',' ',' ',' ',' ','p',' ',' ','p',' ',' ',' ','p',' ',' ',' ',' ',' ','p','X',
    'X','X',' ',' ',' ','X','X','X',' ','p','p','p','p','p',' ','p','X','X','p','p','X','X',' ',' ','X',
    'X',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','X',
    'X',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','X',
    'X',' ',' ',' ','X','X','X','X','X','X',' ',' ','X',' ',' ',' ',' ','X','X','X','X',' ',' ',' ','X',
    'X',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','X','X',
    'X',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','X',
    'X','X','P',' ',' ',' ',' ',' ',' ','P',' ',' ','P','P','P',' ','P','P',' ',' ',' ',' ',' ','P','X',
    'X','X','P',' ',' ','P',' ',' ',' ','P',' ','P',' ',' ',' ','P',' ',' ',' ',' ',' ','P',' ',' ','X',
    'X','X',' ','P','N','P',' ','X',' ',' ','X',' ',' ','X','R',' ','X','X','X','X','X',' ','B','X','X',
    'X','X','P','P','X',' ',' ','X','N',' ','X','P','R','P','N',' ',' ','R','N','P','B',' ','N',' ','X',
    'X','X','Q',' ',' ',' ',' ','X','B',' ','X','P',' ',' ','P',' ',' ',' ',' ',' ','P',' ',' ',' ','X',
    'X',' ',' ',' ',' ',' ','B','X',' ',' ','X',' ',' ',' ','K','R',' ','B','X','X','X','X','X','X','X',
    'X',' ',' ',' ','N',' ',' ','X',' ',' ','X','R',' ',' ',' ',' ',' ',' ',' ','B',' ',' ',' ',' ','X',
    'X',' ',' ',' ','X',' ',' ','X',' ','R',' ',' ',' ','X','X','X',' ',' ',' ',' ',' ',' ',' ',' ','X',
    'X','X',' ',' ','X',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','X','X','X','X','X','X',
    'X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X'];
var L=25;

if(document.title=="hologram")
{
    A=['X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X',
        'X','X',' ',' ',' ',' ',' ',' ',' ','b',' ',' ',' ',' ','b','X','X',
        'X',' ',' ','q','k',' ',' ',' ',' ',' ',' ','X','X',' ',' ',' ','X',
        'X',' ',' ',' ','X','X','n',' ','X',' ',' ',' ',' ',' ',' ',' ','X',
        'X',' ',' ',' ','n',' ',' ',' ','X',' ',' ',' ','p',' ',' ','r','X',
        'X','p','p',' ','r','p',' ',' ','p',' ',' ',' ',' ','p',' ','p','X',
        'X','p','X','X','X','X',' ',' ',' ',' ',' ',' ','X',' ',' ','X','X',
        'X',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','X','X',
        'X',' ',' ',' ',' ',' ',' ',' ','X',' ',' ',' ',' ',' ',' ',' ','X',
        'X',' ','X','X','X',' ',' ',' ',' ',' ',' ','X',' ',' ',' ',' ','X',
        'X','P',' ',' ',' ',' ',' ',' ',' ','P',' ',' ',' ',' ','P',' ','X',
        'X',' ','P','N',' ',' ',' ','R','P','P','N',' ',' ',' ','P','X','X',
        'X','Q','X',' ',' ','X','X',' ',' ',' ',' ',' ','P',' ','K','X','X',
        'X',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','X','X',
        'X',' ',' ',' ',' ',' ','B','R',' ','X','X','X','X',' ',' ','X','X',
        'X','X','X','X','X','X','X',' ',' ',' ',' ',' ','B',' ',' ',' ','X',
        'X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X'];

    L=17;
}






function colListener (main, collided)
{
    var m=main.object;
    var c=collided.object;
    var pos = c.physicsImpostor.getObjectCenter();

    var dx=c.position.x-m.position.x;
    var dz=c.position.z-m.position.z;
    pos.x+=dx/4;
    pos.z+=dz/4;
    collided.object.physicsImpostor.applyImpulse(new BABYLON.Vector3(dx/4, 1, dz/4), pos);

    //console.log(m.getDirection(BABYLON.Vector3.Forward()));
}

function clearBoard()
{
    for (var i=0 ; i<L*L ; i++)
    {
        if(A[i]!=='X') A[i]=' ';
    }
}

function recoverBoard()
{
    clearBoard();
    for (var i=0 ; i<pieces.length ; i++)
    {
        p=pieces[i];
        if (p.visibility==1)
        {
            var TT=Math.floor(L/2);
            var x=Math.floor(((p.position.x+5)/10)+TT);
            var z=Math.floor(((p.position.z+5)/10)+TT);
            if (x>0 && x<L-1 && z>0 && z<L-1)
            {
                A[x+z*L]=p.name;
            }
        }
    }
    dumpBoard();
}

function getMesh(pos,t)
{
    // console.log("pos:"+pos);
    // console.log("t  :"+t);
    for (var i=0 ; i<pieces.length ; i++)
    {
        var TT=Math.floor(L/2);
        p=pieces[i];
        var x=Math.floor(((p.position.x+5)/10)+TT);
        var z=Math.floor(((p.position.z+5)/10)+TT);
        if (x>0 && x<L-1 && z>0 && z<L-1)
        {
            if (x+z*L==pos && A[x+z*L]==t)    return p;
        }
    }
    return null;
}

function getMeshT(t)
{

    for (var i=0 ; i<pieces.length ; i++)
    {
        var TT=Math.floor(L/2);
        p=pieces[i];
        var x=Math.floor(((p.position.x+5)/10)+TT);
        var z=Math.floor(((p.position.z+5)/10)+TT);
        if (x>0 && x<L-1 && z>0 && z<L-1)
        {
            if (p.visibility==1 && A[x+z*L]==t)    return p;
        }
    }
    return null;
}

function makeMove(m)
{
    a=getMesh(m[1],m[0]);
    if (a!=null)
    {
        b=getMesh(m[2],A[m[2]]);
        if (b!=null)
        {
            a.physicsImpostor.registerOnPhysicsCollide(b.physicsImpostor, colListener);
            a['targetCollide']=b;
        }
        var TT=Math.floor(L/2);
        var x=(Math.floor(m[2]%L)-TT)*10;
        var y=(Math.floor(m[2]/L)-TT)*10;
        a['targetX']=x;
        a['targetZ']=y;
        a['targetCount']=1000;

    }
    else
    {

        if (gameover!=0) return;
        gameover=1;

        a=getMeshT('k');
        if (a==null)
            a=getMeshT('K');

        if (a!=null)
        {
            //console.log("gameover: "+gameover);


            var s=5;
            a.scaling.x=s;
            a.scaling.y=s;
            a.scaling.z=s;
            cameraspin=0.05;

            a.physicsImpostor.setMass(1000);
            a['targetX']=0;
            a['targetZ']=0;
            console.log("NO MOVE ...");

            for (var i=0 ; i<pieces.length ; i++)
            {
                p=pieces[i];
                if (p.visibility==1 && p!==a)
                {
                    t=Math.random()*2*Math.PI;
                    p['targetX']=Math.cos(t)*80;
                    p['targetZ']=Math.sin(t)*80;
                }
            }
        }
    }
}



function dumpBoard()
{
    var s = "";
    for (var j=L-1 ; j>-1 ; j-=1)
    {
        for (var i=0 ; i<L ; i+=1)
            if (A[i+j*L]===' ')
            {
                if ((i+j)%2===0) s+='.';
                else s+=' ';
            }
            else s += A[i+j*L];
        s += "\n";
    }
    console.log(s)
}


function isEmptySquare(pos) {   return A[pos]===' '; }

function isWhitePiece(pos)  {   return 'kqbnrp'.includes(A[pos]);   }

function isBlackPiece(pos)  {   return 'KQBNRP'.includes(A[pos]);   }

function isWall(pos)        {   return A[pos]==='X'; }


function findWhiteMoves(i)
{
    var m = [];
    if (A[i]==='p')
    {
        if (isEmptySquare(i+L))  m=m.concat([[A[i], i, i+L]]);
        if (isBlackPiece(i+L-1)) m=m.concat([[A[i], i, i+L-1]]);
        if (isBlackPiece(i+L+1)) m=m.concat([[A[i], i, i+L+1]]);
    }
    if (A[i]==='k')
    {
        [-L-1,-L,-L+1,-1,+1,L-1,L,L+1].forEach((d) => {
        if (isEmptySquare(i+d) || isBlackPiece(i+d))
            m=m.concat([[A[i],i,i+d]]);
        });
    }
    if (A[i]==='q')
    {
        [-L-1,-L,-L+1,-1,+1,L-1,L,L+1].forEach((d) => {
            t=d;
            while (isEmptySquare(i+t)){m=m.concat([[A[i],i,i+t]]);t+=d;}
            if (isBlackPiece(i+t)){m=m.concat([[A[i],i,i+t]]);}
        });
    }
    if (A[i]==='b')
    {
        [-L-1,-L+1,L-1,L+1].forEach((d) =>
        {
            t = d;
            while (isEmptySquare(i + t)){m=m.concat([[A[i], i, i + t]]);t += d;}
            if (isBlackPiece(i + t)){m=m.concat([[A[i], i, i + t]]);}
        });
    }
    if (A[i]==='r')
    {
        [-L,+1,-1,L].forEach((d) =>
        {
            t = d;
            while (isEmptySquare(i + t)){m=m.concat([[A[i], i, i + t]]);t += d;}
            if (isBlackPiece(i + t)){m=m.concat([[A[i], i, i + t]]);}
        });
    }
    if (A[i]==='n')
    {
        [[-L-L-1,-L,-L-1],[-L-L+1,-L,-L+1],[L+L-1,+L,L-1],[L+L+1,+L,L+1], [-1-1-L,-1,-1-L],[-1-1+L,-1,-1+L],[1+1-L,+1,1-L],[1+1+L,+1,1+L]].forEach((d) =>
        {
            if (!(isWall(i+d[1]) && isWall(i+d[2])) && (isEmptySquare(i+d[0]) || isBlackPiece(i+d[0]))){
                m=m.concat([[A[i],i,i+d[0]]]);}
        });
    }
    return m;
}


function findAllWhiteMoves()
{
    var m=[];
    for (var i=0 ; i<L*L ; i++)
        m=m.concat(findWhiteMoves(i));
    return m;
}


function findBlackMoves(i)
{
    var m = [];
    var R=-L;
    if (A[i]==='P')
    {
        if (isEmptySquare(i+R))  m=m.concat([[A[i], i, i+R]]);
        if (isWhitePiece(i+R-1)) m=m.concat([[A[i], i, i+R-1]]);
        if (isWhitePiece(i+R+1)) m=m.concat([[A[i], i, i+R+1]]);
    }
    if (A[i]==='K')
    {
        [-R-1,-R,-R+1,-1,+1,R-1,R,R+1].forEach((d) => {
            if (isEmptySquare(i+d) || isWhitePiece(i+d))
                m=m.concat([[A[i],i,i+d]]);
        });
    }
    if (A[i]==='Q')
    {
        [-R-1,-R,-R+1,-1,+1,R-1,R,R+1].forEach((d) => {
            t=d;
            while (isEmptySquare(i+t)){m=m.concat([[A[i],i,i+t]]);t+=d;}
            if (isWhitePiece(i+t)){m=m.concat([[A[i],i,i+t]]);}
        });
    }
    if (A[i]==='B')
    {
        [-R-1,-R+1,R-1,R+1].forEach((d) =>
        {
            t = d;
            while (isEmptySquare(i + t)){m=m.concat([[A[i], i, i + t]]);t += d;}
            if (isWhitePiece(i + t)){m=m.concat([[A[i], i, i + t]]);}
        });
    }
    if (A[i]==='R')
    {
        [-R,+1,-1,R].forEach((d) =>
        {
            t = d;
            while (isEmptySquare(i + t)){m=m.concat([[A[i], i, i + t]]);t += d;}
            if (isWhitePiece(i + t)){m=m.concat([[A[i], i, i + t]]);}
        });
    }
    if (A[i]==='N')
    {
        [[-R-R-1,-R,-R-1],[-R-R+1,-R,-R+1],[R+R-1,+R,R-1],[R+R+1,+R,R+1], [-1-1-R,-1,-1-R],[-1-1+R,-1,-1+R],[1+1-R,+1,1-R],[1+1+R,+1,1+R]].forEach((d) =>
        {
            if (!(isWall(i+d[1]) && isWall(i+d[2])) && (isEmptySquare(i+d[0]) || isWhitePiece(i+d[0]))){
                m=m.concat([[A[i],i,i+d[0]]]);}
        });
    }
    return m;
}

function findAllBlackMoves()
{
    var m=[];
    for (var i=0 ; i<L*L ; i++)
        m=m.concat(findBlackMoves(i));
    return m;
}



var values={'P':-1, 'p':1, 'K':-9, 'k':9, 'Q':-7, 'q':7, 'B':-3, 'b':3, 'N':-3, 'n':3, 'R':-4, 'r':4};

function evaluateBoard()
{
    var t=0;
    var blackKing=false;
    var whiteKing=false;
    for (var i=0 ; i<L*L ; i++)
    {
        if (A[i] in values) t+=values[A[i]];
        whiteKing|=(A[i]==='k');
        blackKing|=(A[i]==='K');
    }

    if (!whiteKing) return -100000;
    if (!blackKing) return 100000;
    return t;
}

function duplicatePawnMoves(a)
{
    var r = [];
    for (var i=0 ; i<a.length ; i++)
    {
        m=a[i];
        r.push(m);
        if (m[0]=='p' || m[0]=='P')
        {
            r.push(m);
            r.push(m);
            r.push(m);
        }
    }
    return r;
}

function findBestWhiteMove(level)
{
    var t=evaluateBoard();
    if (Math.abs(t)===100000 || level===0) return [t,[]];
    var moves=findAllWhiteMoves();
    moves=duplicatePawnMoves(moves);
    moves=shuffle(moves);
    var bestmove=moves[0];
    var bestvalue=-1000000;
    var i=0;
    while (i<moves.length && bestvalue!==100000)
    {
        var m=moves[i];
        var save=A[m[2]];
        A[m[2]]=A[m[1]];
        A[m[1]]=' ';
        var value=findBestBlackMove(level-1)[0];
        if (value>bestvalue)
        {
            bestvalue=value;
            bestmove=m;
        }
        A[m[1]]=A[m[2]];
        A[m[2]]=save;
        i+=1;
    }

    return [bestvalue,bestmove];
}



function findBestBlackMove(level)
{
    var t=evaluateBoard();
    if (Math.abs(t)===100000 || level===0) return [t,[]];
    var moves=findAllBlackMoves();
    moves=duplicatePawnMoves(moves);
    moves=shuffle(moves);
    var bestmove=moves[0];
    var bestvalue=1000000;
    var i=0;
    while (i<moves.length && bestvalue!==-100000)
    {
        var m=moves[i];
        var save=A[m[2]];
        A[m[2]]=A[m[1]];
        A[m[1]]=' ';
        var value=findBestWhiteMove(level-1)[0];
        if (value<bestvalue)
        {
            bestvalue=value;
            bestmove=m;
        }
        A[m[1]]=A[m[2]];
        A[m[2]]=save;
        i+=1;
    }

    return [bestvalue,bestmove];
}






function showNormals(mesh, size, color, sc)
{
    var normals = mesh.getVerticesData(BABYLON.VertexBuffer.NormalKind);
    var positions = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    color = color || BABYLON.Color3.White();
    sc = sc || scene;
    size = size || 1;

    var lines = [];
    for (var i = 0; i < normals.length; i += 3)
    {
        var v1 = BABYLON.Vector3.FromArray(positions, i);
        var v2 = v1.add(BABYLON.Vector3.FromArray(normals, i).scaleInPlace(size));
        lines.push([v1.add(mesh.position), v2.add(mesh.position)]);
    }
    var normalLines = BABYLON.MeshBuilder.CreateLineSystem("normalLines", {lines: lines}, sc);
    normalLines.color = color;
    return normalLines;
}

//Tree generator code

var coordSystem = function (b)
{
    var g = b.normalize();
    b = 0 == Math.abs(b.x) && 0 == Math.abs(b.y) ? (new BABYLON.Vector3(b.z, 0, 0)).normalize() : (new BABYLON.Vector3(b.y, -b.x, 0)).normalize();
    var r = BABYLON.Vector3.Cross(b, g);
    return {x: b, y: g, z: r}
}, randPct = function (b, g)
{
    return 0 == g ? b : (1 + (1 - 2 * Math.random()) * g) * b
}, createBranch = function (b, g, r, w, h, l, v, n, x)
{
    for (var t = [], d, c = [], f, q = [], a = 0; 12 > a; a++) t[a] = [];
    for (var m = 0; m < h; m++) for (a = m / h, d = g.y.scale(a * r), d.addInPlace(g.x.scale(v * Math.exp(-a) * Math.sin(l * a * Math.PI))), d.addInPlace(b), c[m] = d, d = n * (1 + (.4 * Math.random() - .2)) * (1 - (1 - w) * a), q.push(d), a = 0; 12 > a; a++) f = a * Math.PI / 6, f = g.x.scale(d * Math.cos(f)).add(g.z.scale(d * Math.sin(f))), f.addInPlace(c[m]), t[a].push(f);
    for (a = 0; 12 > a; a++) t[a].push(c[c.length - 1]);
    return {branch: BABYLON.MeshBuilder.CreateRibbon("branch", {pathArray: t, closeArray: !0}, x), core: c, _radii: q}
}, createTreeBase = function (b, g, r, w, h, l, v, n, x, t)
{
    var d = 2 / (1 + Math.sqrt(5)), c = new BABYLON.Vector3(0, 1, 0), f, c = coordSystem(c),
        q = new BABYLON.Vector3(0, 0, 0), a = [], m = [], e = [], A = [], q = createBranch(q, c, b, g, r, 1, x, 1, t);
    a.push(q.branch);
    var y = q.core;
    m.push(y);
    e.push(q._radii);
    A.push(c);
    for (var q = y[y.length - 1], y = 2 * Math.PI / h, z, u, p, C, B = 0; B < h; B++) if (f = randPct(B * y, .25), f = c.y.scale(Math.cos(randPct(l, .15))).add(c.x.scale(Math.sin(randPct(l, .15)) * Math.sin(f))).add(c.z.scale(Math.sin(randPct(l, .15)) * Math.cos(f))), z = coordSystem(f), f = createBranch(q, z, b * v, g, r, n, x * d, g, t), p = f.core, p = p[p.length - 1], a.push(f.branch), m.push(f.core), e.push(f._radii), A.push(z), 1 < w) for (var D = 0; D < h; D++) u = randPct(D * y, .25), u = z.y.scale(Math.cos(randPct(l, .15))).add(z.x.scale(Math.sin(randPct(l, .15)) * Math.sin(u))).add(z.z.scale(Math.sin(randPct(l, .15)) * Math.cos(u))), u = coordSystem(u), C = createBranch(p, u, b * v * v, g, r, n, x * d * d, g * g, t), a.push(C.branch), m.push(C.core), e.push(f._radii), A.push(u);
    return {tree: BABYLON.Mesh.MergeMeshes(a), paths: m, radii: e, directions: A}
}, createTree = function (b, g, r, w, h, l, v, n, x, t, d, c, f, q, a, m)
{
    1 != h && 2 != h && (h = 1);
    var e = createTreeBase(b, g, r, h, l, v, n, d, c, m);
    e.tree.material = w;
    var A = b * Math.pow(n, h), y = A / (2 * f), z = 1.5 * Math.pow(g, h - 1);
    n = BABYLON.MeshBuilder.CreateDisc("leaf", {
        radius: z / 2,
        tessellation: 12,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE
    }, m);
    b = new BABYLON.SolidParticleSystem("leaveSPS", m, {updatable: !1});
    b.addShape(n, 2 * f * Math.pow(l, h), {
        positionFunction: function (b, a, g)
        {
            a = Math.floor(g / (2 * f));
            1 == h ? a++ : a = 2 + a % l + Math.floor(a / l) * (l + 1);
            var E = (g % (2 * f) * y + 3 * y / 2) / A, d = Math.ceil(r * E);
            d > e.paths[a].length - 1 && (d = e.paths[a].length - 1);
            var k = d - 1, c = k / (r - 1), m = d / (r - 1);
            b.position = new BABYLON.Vector3(e.paths[a][k].x + (e.paths[a][d].x - e.paths[a][k].x) * (E - c) / (m - c), e.paths[a][k].y + (e.paths[a][d].y - e.paths[a][k].y) * (E - c) / (m - c) + (.6 * z / q + e.radii[a][d]) * (g % 2 * 2 - 1), e.paths[a][k].z + (e.paths[a][d].z - e.paths[a][k].z) * (E - c) / (m - c));
            b.rotation.z = Math.random() * Math.PI / 4;
            b.rotation.y = Math.random() * Math.PI / 2;
            b.rotation.z = Math.random() * Math.PI / 4;
            b.scale.y = 1 / q
        }
    });
    b = b.buildMesh();
    b.billboard = !0;
    n.dispose();
    d = new BABYLON.SolidParticleSystem("miniSPS", m, {updatable: !1});
    n = new BABYLON.SolidParticleSystem("minileavesSPS", m, {updatable: !1});
    var u = [];
    c = 2 * Math.PI / l;
    for (var p = 0; p < Math.pow(l, h + 1); p++) u.push(randPct(Math.floor(p / Math.pow(l, h)) * c, .2));
    c = function (a, b, d)
    {
        var c = d % Math.pow(l, h);
        1 == h ? c++ : c = 2 + c % l + Math.floor(c / l) * (l + 1);
        var f = e.directions[c],
            c = new BABYLON.Vector3(e.paths[c][e.paths[c].length - 1].x, e.paths[c][e.paths[c].length - 1].y, e.paths[c][e.paths[c].length - 1].z),
            k = u[d],
            k = f.y.scale(Math.cos(randPct(v, 0))).add(f.x.scale(Math.sin(randPct(v, 0)) * Math.sin(k))).add(f.z.scale(Math.sin(randPct(v, 0)) * Math.cos(k))),
            f = BABYLON.Vector3.Cross(BABYLON.Axis.Y, k),
            k = Math.acos(BABYLON.Vector3.Dot(k, BABYLON.Axis.Y) / k.length());
        a.scale = new BABYLON.Vector3(Math.pow(g, h + 1), Math.pow(g, h + 1), Math.pow(g, h + 1));
        a.quaternion = BABYLON.Quaternion.RotationAxis(f, k);
        a.position = c;
    };
    for (var C = [], B = [], p = e.paths.length, D = e.paths[0].length, F = 0; F < x; F++) C.push(2 * Math.PI * Math.random() - Math.PI), B.push([Math.floor(Math.random() * p), Math.floor(Math.random() * (D - 1) + 1)]);
    p = function (a, c, b)
    {
        var d = B[b][0], f = B[b][1], k = e.directions[d];
        c = new BABYLON.Vector3(e.paths[d][f].x, e.paths[d][f].y, e.paths[d][f].z);
        c.addInPlace(k.z.scale(e.radii[d][f] / 2));
        b = C[b];
        k = k.y.scale(Math.cos(randPct(t, 0))).add(k.x.scale(Math.sin(randPct(t, 0)) * Math.sin(b))).add(k.z.scale(Math.sin(randPct(t, 0)) * Math.cos(b)));
        b = BABYLON.Vector3.Cross(BABYLON.Axis.Y, k);
        k = Math.acos(BABYLON.Vector3.Dot(k, BABYLON.Axis.Y) / k.length());
        a.scale = new BABYLON.Vector3(Math.pow(g, h + 1), Math.pow(g, h + 1), Math.pow(g, h + 1));
        a.quaternion = BABYLON.Quaternion.RotationAxis(b, k);
        a.position = c
    };
    d.addShape(e.tree, Math.pow(l, h + 1), {positionFunction: c});
    d.addShape(e.tree, x, {positionFunction: p});
    d = d.buildMesh();
    d.material = w;
    n.addShape(b, Math.pow(l, h + 1), {positionFunction: c});
    n.addShape(b, x, {positionFunction: p});
    w = n.buildMesh();
    b.dispose();
    w.material = a;
    a = BABYLON.MeshBuilder.CreateBox("", {}, m);
    a.isVisible = !1;
    e.tree.parent = a;
    d.parent = a;
    return w.parent = a
};

//End of Tree generator code


var checkFallen = function ()
{
    //console.log("bouninginfo:"+currentMesh.getBoundingInfo().boundingBox.directions[1]);

    pieces.forEach(function(p) {
        if (p.visibility<1 || p.getBoundingInfo().boundingBox.directions[1].y<0.2)
        {
            p.visibility-=0.001;
            if(p.visibility<0)
                p.enabled=false;
        }
    });
}


var moveToTarget = function ()
{
    //console.log("bouninginfo:"+currentMesh.getBoundingInfo().boundingBox.directions[1]);
    computerMoveInProgress=false;
    pieces.forEach(function(p) {
        if (p.hasOwnProperty('targetX') && p.hasOwnProperty('targetZ'))
        {
            computerMoveInProgress=true;
            whiteToMove= ("PKQBNR".includes(p.name));
            var dx = p['targetX']-p.position.x;
            var dz = p['targetZ']-p.position.z;

            var t = Math.sqrt(dx*dx+dz*dz);
            dx = dx/t;
            dz = dz/t
            p.position.x += dx;
            p.position.z += dz;
            //console.log("move to target...");

            if (t<2 || p['targetCount']<1)
            {
                delete  p.targetX;
                delete  p.targetZ;
                delete  p.targetCount;
                if (p.hasOwnProperty('targetCollide'))
                {
                    p.physicsImpostor.unregisterOnPhysicsCollide(p['targetCollide'].physicsImpostor, colListener);
                    delete p.targetCollide;
                }
            }
        }
    });
}


var createScene = function ()
{

    var scene = new BABYLON.Scene(engine);
    //Ammo();
    scene.enablePhysics(new BABYLON.Vector3(0, -10, 0), new BABYLON.AmmoJSPlugin());
    //  scene.enablePhysics();
    // Ammo();
    //Adding a light
    var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(20, 20, 100), scene);
    light.intensity=1.0;

    if (document.title!="hologram")
    {
        camera = new BABYLON.ArcRotateCamera("Camera", 0, 1.3, 220, new BABYLON.Vector3(0, 0, 0), scene);
    }
    else
    {
        camera = new BABYLON.ArcRotateCamera("Camera", 0, 1.1, 300, new BABYLON.Vector3(0, 0, 0), scene);
        scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);
        groundsize=L*10;
    }

    camera.attachControl(canvas, false);

    camera.lowerBetaLimit = 0;
    camera.upperBetaLimit = Math.PI /2-0.1;

    ground = BABYLON.Mesh.CreateGround("ground", groundsize, groundsize, 0, scene, true);
    //ground.position.x -= 200;
    ground.position.y = 0;
    var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
    groundMaterial.specularColor = new BABYLON.Color4(0, 1.0, 0);
    groundMaterial.diffuseColor = new BABYLON.Color4(0, 1.0, 0);
    ground.material = groundMaterial;

    //groundMaterial.diffuseColor = BABYLON.Color3(0.1, 1.0, 0.0);
    ground.visibility = 1;
    ground.isPickable = false;
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 0,
        restitution: 0.9
    }, scene);
    //ground.showBoundingBox = true;


    //SKY

    if (document.title!="hologram")
    {
        // Sky material
        var skyboxMaterial = new BABYLON.SkyMaterial("skyMaterial", scene);
        skyboxMaterial.backFaceCulling = false;
        //skyboxMaterial._cachedDefines.FOG = true;
        skyboxMaterial.turbidity = 2;
        skyboxMaterial.luminance = 0.05;
        skyboxMaterial.inclination = 0.45; // The solar inclination, related to the solar azimuth in interval [0, 1]
        skyboxMaterial.azimuth = 0.05; // The solar azimuth in interval [0, 1]

        // Sky mesh (box)
        skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene);
        skybox.material = skyboxMaterial;
        skybox.isPickable=false;
        skybox.position.y+=0;
    }

    var TT=Math.floor(L/2);
    for (var i=-TT+1 ; i<TT ; i++)
        for (var j=-TT+1 ; j<TT ; j++)
        {
            //if (A[i+10][j+10]==1)   continue;
            var ground2 = BABYLON.Mesh.CreateGround("ground2", 10, 10, 0, scene, false);
            ground2.position.x = i*10;
            ground2.position.z = j*10;
            ground2.position.y = 0.1;
            ground2.visibility = 1;
            var ground2Material = new BABYLON.StandardMaterial("ground2", scene);
            if ((i+j)%2==0)
            {
                ground2Material.specularColor = new BABYLON.Color3(0.0, 0.0, 0.0);
                ground2Material.diffuseColor = new BABYLON.Color3(0.0, 0.0, 0.0);
            }
            else
            {
                ground2Material.specularColor = new BABYLON.Color3(1.0, 1.0, 1.0);
                ground2Material.diffuseColor = new BABYLON.Color3(1.0, 1.0, 1.0);

            }
            if (A[i+TT+(j+TT)*L]=='X')
            {
                ground2Material.specularColor = new BABYLON.Color3(0.4, 1.0, 0.4);
                ground2Material.diffuseColor = new BABYLON.Color3(0.4, 1.0, 0.4);
                ground2Material.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);
                ground2.position.y=3.2;//2.8+((3*i+7*j)%5)*0.1;
                ground2.visibility = 0.5;//+((3*i+7*j)%5)*0.08;

                // var ground3 = ground2.clone();
                // ground3.position.y=1.6;
                // ground3.material = ground2Material;
                // ground3.isPickable = false;
                // ground3.physicsImpostor = new BABYLON.PhysicsImpostor(ground3, BABYLON.PhysicsImpostor.BoxImpostor, {
                //     mass: 0,
                //     restitution: 0.9
                // }, scene);
            }

            // if (i<-5 && j<-5)
            //     ground2Material.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);

            ground2.material = ground2Material;

            ground2.isPickable = false;
            ground2.physicsImpostor = new BABYLON.PhysicsImpostor(ground2, BABYLON.PhysicsImpostor.BoxImpostor, {
                mass: 0,
                restitution: 0.9
            }, scene);
            //ground2.showBoundingBox = true;
        }



    var assetsManager = new BABYLON.AssetsManager(scene);
    //   var meshTask = assetsManager.addMeshTask("skull task", "", "scenes/", "skull.babylon");
//     var meshTask = assetsManager.addMeshTask("king", "", "./", "king.stl");
//     assetsManager.addMeshTask("queen", "", "./", "queen.stl");
//     assetsManager.addMeshTask("rook", "", "./", "rook.stl");
//     assetsManager.addMeshTask("knight", "", "./", "knight.stl");
//     assetsManager.addMeshTask("bishop", "", "./", "bishop.stl");
// //            assetsManager.addMeshTask("pawn", "", "./", "pawn.stl");
//     assetsManager.addMeshTask("pawn", "", "./", "pawn.stl");
//
//     meshTask.onSuccess = function (task)
//     {
//         task.loadedMeshes[0].position = BABYLON.Vector3.Zero();
//     }


    const meshes = [
        'king_k',
        'queen_q',
        'bishop_b',
        'knight_n',
        'rook_r',
        'pawn_p'
    ]
// skipped code that creates assetsManager

    var pos_x = 0;
// queue the guns to be loaded...
    meshes.forEach(tmpX =>
    {
        var tmp=tmpX.split('_')[0];
        var tmp2=tmpX.split('_')[1];
        const fname = `${tmp}.stl`
//        const fname = `${tmp}.gltf`
        const name = `${tmp2}`
        const meshTask = assetsManager.addMeshTask(name, '', "./", fname)


        meshTask.onSuccess = (task) =>
        {
            mesh = task.loadedMeshes[0];
            mesh.setEnabled(false);
            var whiteMaterial = new BABYLON.StandardMaterial("whiteMaterial", scene);
            whiteMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 1.0);
            whiteMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
            mesh.material = whiteMaterial;
            mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.CylinderImpostor, {
                mass: 0.1,
                restitution: 0.9
            }, scene);
            mesh.material = whiteMaterial;
            meshes_pieces.set(task.name.toLowerCase(),mesh);
            mesh.rotate(BABYLON.Axis.Y, 3*Math.PI/2, BABYLON.Space.WORLD);

            mesh = mesh.clone();
            var blackMaterial = new BABYLON.StandardMaterial("blackMaterial", scene);
            blackMaterial.diffuseColor = new BABYLON.Color3(1.0, 0.4, 0.4);
            blackMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
            mesh.material = blackMaterial;
            mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.CylinderImpostor, {
                mass: 0.1,
                restitution: 0.9
            }, scene);
            mesh.material = blackMaterial;
            meshes_pieces.set(task.name.toUpperCase(),mesh);
            mesh.rotate(BABYLON.Axis.Y, 6*Math.PI/2, BABYLON.Space.WORLD);


            // mesh = task.loadedMeshes[0];
            // mesh.position = BABYLON.Vector3.Zero();
            // mesh.position.x = pos_x;
            // mesh.position.y += mesh.getBoundingInfo().boundingBox.extendSize.y;
            // pos_x += 10;
            // console.log("loaded mesh:" + task.name);
            // // disable the original mesh and store it in the Atlas
            // //         task.loadedMeshes[0].setEnabled(false)
            // //         Atlas.gunMeshes.set(gun, task.loadedMeshes[0])
            // var meshMaterial = new BABYLON.StandardMaterial("mesh", scene);
            // meshMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 1.0);
            // meshMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
            // mesh.material = meshMaterial;
            //
            // mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.CylinderImpostor, {
            //     mass: 0.1,
            //     restitution: 0.9
            // }, scene);
            // // mesh.showBoundingBox = true;
            //
            // //   showNormals(mesh, 0.25, new BABYLON.Color3(1, 0, 0));
            //
            // // var offs=mesh.getBoundingInfo().boundingBox.extendSize.y-5;
            // // mesh.physicsImpostor.setDeltaPosition(new BABYLON.Vector3(0, -offs,0));
        }
    })


    // Move the light with the camera
    scene.registerBeforeRender(function ()
    {
        light.position = camera.position;
    });

    assetsManager.onFinish = function (tasks)
    {
        console.log("meshes loaded");
        var TT=Math.floor(L/2);
        for (var i=-TT ; i<TT+1 ; i++)
            for (var j=-TT ; j<TT+1 ; j++)
            {
                var c=A[i+TT+(j+TT)*L];
                if ("KkQqBbNnRrPp".includes(c))
                {
                    var mesh=meshes_pieces.get(c).clone();
                    mesh.material=mesh.material.clone();
                    // if (c=='N')
                    // {
                    //    // mesh.rotation=new BABYLON.Vector3(Math.PI, 0, 0);
                    //     mesh.rotate(BABYLON.Axis.Y, Math.PI, BABYLON.Space.WORLD);
                    //
                    // }
                    mesh.position.x = i * 10;
                    mesh.position.z = j * 10;
                    mesh.position.y = 1.2;
                    mesh.setEnabled(true);
                    mesh.name=c;
                    pieces.push(mesh);
                }

            }

        //var physicsViewer = new BABYLON.PhysicsViewer(scene);

        // scene.meshes.forEach(mesh =>{
        //     if (mesh.physicsImpostor) {
        //         physicsViewer.showImpostor(mesh.physicsImpostor, mesh);
        //     }
        // });

        // const frameRate = 30;
        // const xSlide = new BABYLON.Animation("xSlide", "position.x", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        // const keyFrames = [];
        //
        // keyFrames.push({
        //     frame: 0,
        //     value: 80
        // });
        //
        // keyFrames.push({
        //     frame: frameRate,
        //     value: -80
        // });
        //
        // keyFrames.push({
        //     frame: 2 * frameRate,
        //     value: 80
        // });
        //
        // xSlide.setKeys(keyFrames);
        //
        // scene.meshes[1].animations.push(xSlide);
        //
        // scene.beginAnimation(scene.meshes[1], 0, 2 * frameRate, true);

        // var mesh=scene.meshes[0];
        // var pos=mesh.physicsImpostor.getObjectCenter();
        // mesh.physicsImpostor.applyImpulse(new BABYLON.Vector3(100,100,0),pos);

        // var ball = BABYLON.MeshBuilder.CreateSphere("ball", {diameter: 200}, scene);
        // ball.position=pos;

    };

    assetsManager.load();


    var getGroundPosition = function ()
    {
        //console.log("getGroundPosition");
        // Use a predicate to get position on the ground
        var pickinfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh)
        {
            return mesh == ground;
        });
        if (pickinfo.hit)
        {
            //console.log("pickedPoint:" + pickinfo.pickedPoint);
            return pickinfo.pickedPoint;
        }
        //console.log("not found");
        return null;
    }



    var onPointerDown = function (evt)
    {
        // dumpBoard();
        // recoverBoard();
        // dumpBoard();
        // console.log(findAllWhiteMoves());
        // console.log(findAllBlackMoves());
        // console.log(evaluateBoard());
        // console.log(findBestWhiteMove(2));

        // currentMesh['targetCount']=200;

        // recoverBoard();
        // m=findBestWhiteMove(2);
        // console.log("best move:",m);
        // makeMove(m[1]);

        if (evt.button !== 0)
        {
            return;
        }

        // check if we are under a mesh
//                                     var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh !== ground; });
        var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh)
        {
            return mesh.isPickable && mesh.name.length==1;
        });
        if (pickInfo.hit)
        {
            currentMesh = pickInfo.pickedMesh;
            startingPoint = getGroundPosition(evt);

            console.log("current:"+currentMesh.name);
            console.log("isPickable:"+currentMesh.isPickable);

            var x=Math.floor(((currentMesh.position.x+5)/10)+12);
            var z=Math.floor(((currentMesh.position.z+5)/10)+12);
            startingPosition= x+z*L;
            //console.log("hit2:" + currentMesh.name);
            //console.log("bouninginfo:"+currentMesh.getBoundingInfo().boundingBox.directions[1]);
            //currentMesh.isVisible=false
            //                currentMesh.position.y+=50;

            //currentMesh.alpha=0.3;

            //          var forceDirection = new BABYLON.Vector3(10, 80, 0);
            //        var forceMagnitude = 50;
            //        var contactLocalRefPoint = BABYLON.Vector3.Zero();
            //        currentMesh.physicsImpostor.applyForce(forceDirection.scale(forceMagnitude), mesh.getAbsolutePosition().add(contactLocalRefPoint));

            if (currentMesh.physicsImpostor)
            {
//            currentMesh.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(10,30,30));
                //           currentMesh.physicsImpostor.setMass(-200);
            }
            if (startingPoint)
            { // we need to disconnect camera from canvas
                setTimeout(function ()
                {
                    camera.detachControl(canvas);
                    humanMoveInProgress=true;
                }, 0);
            }

            pieces.forEach(function(p) {
                if (p!=currentMesh)
                    currentMesh.physicsImpostor.registerOnPhysicsCollide(p.physicsImpostor, colListener);
            });

            // currentMesh['targetX']=currentMesh.position.x+40;
            // currentMesh['targetZ']=currentMesh.position.z+40;
            // currentMesh['targetX']=0;
            // currentMesh['targetZ']=0;
            // currentMesh['targetCount']=600;
        }
    }

    var onPointerUp = function ()
    {
        if (startingPoint)
        {
            currentMesh.position.y += 0.5;

            camera.attachControl(canvas, true);
            humanMoveInProgress=false;

            startingPoint = null;
            //  dumpPositions();
            pieces.forEach(function(p) {
                if (p!=currentMesh)
                    currentMesh.physicsImpostor.unregisterOnPhysicsCollide(p.physicsImpostor, colListener);
            });

            whiteToMove= ("PKQBNR".includes(currentMesh.name));
            if(whiteToMove) movCntLimitBlack=60*30;
            else movCntLimitWhite=60*30;

            var x=Math.floor(((currentMesh.position.x+5)/10)+12);
            var z=Math.floor(((currentMesh.position.z+5)/10)+12);
            if (startingPosition=== x+z*L)    whiteToMove= !whiteToMove;

            return;
        }
    }

    var onPointerMove = function (evt)
    {
        if (!startingPoint)
        {
            return;
        }

        var current = getGroundPosition(evt);

        if (!current)
        {
            return;
        }
        var diff = current.subtract(startingPoint);
        currentMesh.position.addInPlace(diff);
        startingPoint = current;

    }

    canvas.addEventListener("pointerdown", onPointerDown, false);
    canvas.addEventListener("pointerup", onPointerUp, false);
    canvas.addEventListener("pointermove", onPointerMove, false);

    scene.onDispose = function ()
    {
        canvas.removeEventListener("pointerdown", onPointerDown);
        canvas.removeEventListener("pointerup", onPointerUp);
        canvas.removeEventListener("pointermove", onPointerMove);
    }






    //leaf material
    leafcolor = new BABYLON.StandardMaterial("green", scene);
    leafcolor.diffuseColor = new BABYLON.Color3(0,1,0);

    //trunk and branch material
    var bark = new BABYLON.StandardMaterial("bark", scene);
    bark.emissiveTexture = new BABYLON.Texture("https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Bark_texture_wood.jpg/800px-Bark_texture_wood.jpg", scene);
    bark.diffuseTexture = new BABYLON.Texture("https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Bark_texture_wood.jpg/800px-Bark_texture_wood.jpg", scene);
    bark.diffuseTexture.uScale = 2.0;//Repeat 5 times on the Vertical Axes
    bark.diffuseTexture.vScale = 2.0;//Repeat 5 times on the Horizontal Axes

    //Tree parameters
    var trunk_height = 20;
    var trunk_taper = 0.6;
    var trunk_slices = 5;
    var boughs = 2; // 1 or 2
    var forks = 4;
    var fork_angle = Math.PI/4;
    var fork_ratio = 2/(1+Math.sqrt(5)); //PHI the golden ratio
    var branch_angle = Math.PI/3;
    var bow_freq = 2;
    var bow_height = 3.5;
    var branches = 10;
    var leaves_on_branch = 5;
    var leaf_wh_ratio = 0.5;

    //hologram
//    var tree = createTree(2.5*trunk_height, trunk_taper, trunk_slices, bark, boughs, forks, fork_angle, fork_ratio, branches, branch_angle, bow_freq, bow_height, leaves_on_branch*2, leaf_wh_ratio, leafcolor, scene);
    var tree = createTree(trunk_height, trunk_taper, trunk_slices, bark, boughs, forks, fork_angle, fork_ratio, branches, branch_angle, bow_freq, bow_height, leaves_on_branch, leaf_wh_ratio, leafcolor, scene);
    //tree.position.y = -10;

    return scene;
}
window.initFunction = async function ()
{


    var asyncEngineCreation = async function ()
    {
        try
        {
            return createDefaultEngine();
        } catch (e)
        {
            console.log("the available createEngine function failed. Creating the default engine instead");
            return createDefaultEngine();
        }
    }

    window.engine = await asyncEngineCreation();
    if (!engine) throw 'engine should not be null.';
    await Ammo();
    window.scene = createScene();
};


var movCnt=1;
function compNextMove()
{
    movCnt++;
    // const myPromise = new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //         resolve('foo');
    //     }, 300);
    // });
    if (computerMoveInProgress || humanMoveInProgress)  movCnt=1;

    if (movCnt%movCntLimitWhite===0  &&  whiteToMove)
    {
        movCntLimitWhite=100;
        //console.log("***");
        const myPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                recoverBoard();
                m=findBestWhiteMove(1);
                resolve(m);
            }, 300);
        });

        myPromise.then(m => makeMove(m[1]));
    }
    if (movCnt%movCntLimitBlack===0   &&  !whiteToMove)
    {
        movCntLimitBlack=100;
        //console.log("***");
        const myPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                recoverBoard();
                m=findBestBlackMove(1);
                resolve(m);
            }, 300);
        });

        myPromise.then(m => makeMove(m[1]));
    }
}


initFunction().then(() =>
{
    var loopcount = 0;
    sceneToRender = scene;
    engine.runRenderLoop(function ()
    {
        if (sceneToRender && sceneToRender.activeCamera)
        {
            //skybox.rotation.y += 1;
            //skyboxMaterial.reflectionTexture.rotationY += 0.001;


            sceneToRender.render();
            loopcount += 1;
            // if (loopcount == 8000)
            // {
            //     var mesh = sceneToRender.meshes[2];
            //     var pos = mesh.physicsImpostor.getObjectCenter();
            //     mesh.physicsImpostor.applyImpulse(new BABYLON.Vector3(1, 1, 0), pos);
            //     console.log("IMPULSE ..." + mesh.name);
            // }
            // if (loopcount == 200)
            // {
            //     leafcolor.diffuseColor = new BABYLON.Color3(1,0,0);
            //     console.log("LEAFCOLOR ..." );
            // }
            // sceneToRender.meshes[1].position.y += 0.01;
            // skybox.material.useSunPosition = true; // Do not set sun position from azimuth and inclination
            // skybox.material.sunPosition = camera.position;
            // skybox.material.sunPosition.x=-skybox.material.sunPosition.x;
            // skybox.material.sunPosition.z=skybox.material.sunPosition.z;
            // skybox.material.sunPosition.z=0.5;
            camera.alpha+=cameraspin;
            checkFallen();
            moveToTarget();
            if (gameover>0) gameover++;
            if (gameover==0 && loopcount>1) compNextMove();

            if (gameover===1800) document.location.reload(true);
        }
    });
});

// Resize
window.addEventListener("resize", function ()
{
    engine.resize();
});