document.getElementById("lev1").addEventListener("click", function() { start(1); });
document.getElementById("lev2").addEventListener("click", function() { start(2); });

var minutes = "0";
var seconds = "-1";
var timerTimeout; 
var play = true;
var slider = document.getElementById("slider");
var range; // The number of all fields
var enter; // The number of fields in one row
var gameLevel; // the level of the current game: 1 - easy, 2 - hard
var hidden; // the number of fields are yet hidden
var bombs; // the number of bombs that are on the board
var fields_id; // array with the number of every field: -1 - bomb, 0-8 - how many bombs surrounding
var flags = 0; // the number of flags that user put
var flags_id = []; // array with id of fields where the player put flags



document.getElementById("bombs_nr").innerHTML = slider.value;

slider.oninput = function() 
{
    document.getElementById("bombs_nr").innerHTML = this.value;
}

function start(level)
{
    loadBoard(level);
    startTimer(level);
}


function loadBoard(level)
{
    var board = "";
    gameLevel = level;
    let bomby = slider.value;

    if (gameLevel == 1) 
    {
        range = 100;
        enter = 10;
        document.querySelector(".container").style.cssText = 'width: 300px; height: 300px;';
        document.querySelector("#flags").style.cssText = 'width: 300px; font-size: 30px';
        document.querySelector("#timer").style.cssText = 'width: 300px;';
        document.querySelector("#board").style.cssText = 'min-height: 300px;';
    }
    else 
    {
        range = 400;
        enter = 25;
    }

    bombs = range * (bomby / 100);

    hidden = range - bombs;
    fields_id = new Array(range).fill(0);
    document.getElementById("flags").innerHTML = "Liczba bomb: " + bombs + ", Użyte flagi: " + flags;
    fields_id = drawBombs(fields_id, bombs);

    for (i = 0; i < range; i++)
    {
        board += "<div class='field' id='f" + i + "' onclick='revealField(" + i + ")'" +
        "oncontextmenu='setFlag(" + i + ", event)'></div>";
        if ((i + 1) % enter == 0)
        {
            board += "<div style='clear:both;'></div>";
        }
    }

    document.querySelector("#board").innerHTML = board;
    console.log(fields_id);
}

function startTimer()
{
    seconds++;
    let finalMinutes;
    if (seconds == 60) 
    {
        minutes++;
        seconds = "0";
    }
    
    if (minutes < 10) 
    {
        finalMinutes = "0" + minutes;
    }
    else
    {
        finalMinutes = minutes;
    }

    if (seconds < 10) seconds = "0" + seconds;

    document.getElementById("timer").innerHTML = finalMinutes + ":" + seconds;
    timerTimeout = setTimeout("startTimer()", 1000);
}

function stopTimer()
{
    clearTimeout(timerTimeout);

    if (minutes < 10) minutes = "0" + minutes;
    document.getElementById("timer").innerHTML = "Czas: " + minutes + ":" + seconds;
}

function drawBombs(array, howmany)
{

    var j = 0;
    while (j < howmany) // Drawing bombs
    {
        let random = Number(Math.floor(Math.random()*range));
        if (array[random] == -1)
        {
            continue;
        }
        array[random] = -1;
        j++;
    }

    for (i = 0; i < range; i++)
    {
        if (array[i] == -1) continue;

        var bombyNeighbours = 0;
        var neighbours;
        if (i == 0) // Lewy górny róg
        {
            neighbours = [i + 1, i + enter, i + enter + 1];
            for (somsiad of neighbours)
            {
                if (array[somsiad] == -1) bombyNeighbours++;
            }
            array[i] = bombyNeighbours;
            continue;
        }
        if (i == (enter - 1)) // Prawy górny róg
        {
            neighbours = [i - 1, i + enter - 1, i + enter];
            for (somsiad of neighbours)
            {
                if (array[somsiad] == -1) bombyNeighbours++;
            }
            array[i] = bombyNeighbours;
            continue;
        }
        if (i == (range - enter)) // Lewy dolny róg
        {
            neighbours = [i - enter, i - enter + 1, i + 1];
            for (somsiad of neighbours)
            {
                if (array[somsiad] == -1) bombyNeighbours++;
            }
            array[i] = bombyNeighbours;
            continue;
        }
        if (i == (range - 1)) // Prawy dolny róg
        {
            neighbours = [i - enter - 1, i - enter, i - 1];
            for (somsiad of neighbours)
            {
                if (array[somsiad] == -1) bombyNeighbours++;
            }
            array[i] = bombyNeighbours;
            continue;
        }

        if ((i + 1) % enter == 1) // Pierwsza kolumna (ale bez rogów)
        {
            neighbours = [i - enter, i - enter + 1, i + 1, i + enter, i + enter + 1];
            for (somsiad of neighbours)
            {
                if (array[somsiad] == -1) bombyNeighbours++;
            }
            array[i] = bombyNeighbours;
            continue;
        }

        if ((i + 1) % enter == 0) // Ostatnia kolumna (ale bez rogów)
        {
            neighbours = [i - enter - 1, i - enter, i - 1, i + enter - 1, i + enter];
            for (somsiad of neighbours)
            {
                if (array[somsiad] == -1) bombyNeighbours++;
            }
            array[i] = bombyNeighbours;
            continue;
        }

        { // Wszystkie pozostałe pola
            neighbours = [i - enter - 1, i - enter, i - enter + 1, i - 1, i + 1, i + enter - 1, i + enter, i + enter + 1];
            for (somsiad of neighbours)
            {
                if (array[somsiad] == -1) bombyNeighbours++;
            }
            array[i] = bombyNeighbours;
            continue;
        }
    }

    return array;
}


function setFlag(nr, event)
{
    event.preventDefault();
    let opacity_value = $('#f' + nr).css('opacity');

    if (play == true && opacity_value == 1 )
    {
        if (flags_id.includes(nr)) // changing flag back to hidden
        {
            let idf = flags_id.indexOf(nr);
            flags_id.splice(idf, 1);

            $("#f" + nr).addClass("field");
            $("#f" + nr).removeClass("field_flag");
            
            flags--;
            $("#flags").html("Liczba bomb: " + bombs + ", Użyte flagi: " + flags);
        }
        else // putting flag on a field
        {
            flags_id.push(nr);

            $("#f" + nr).addClass("field_flag");
            $("#f" + nr).removeClass("field");
            
            flags++;
            $("#flags").html("Liczba bomb: " + bombs + ", Użyte flagi: " + flags);
        }
    }
}

function showBombs()
{
   for (i = 0; i < range; i++)
   {
    if (fields_id[i] == -1)
        {
            $("#f" + i).css("background-image", "url('img/bomb.png')");
            $("#f" + i).css("opacity", "0.99");
            $("#f" + i).css("filter", "brightness(100%)");
        }
   }       
}

function revealField(nr)
{
    let opacity_value = $('#f' + nr).css('opacity');

    if (play == true && opacity_value == 1 )
    {
        if (flags_id.includes(nr))
        {
            return ;
        }
        
        if (fields_id[nr] == -1) // Bomb clicked
        {
            $("#f" + nr).css("background-image", "url('img/bomb.png')");
            $("#f" + nr).css("opacity", "0.99");
            $("#f" + nr).css("filter", "brightness(100%)");

            stopTimer();
            play = false;
            $("#flags").html("Porażka <br><span class='reset' onclick='location.reload()'>Jeszcze raz?</span>");
            //play = false;
            showBombs();
            return ;
        }

        if (fields_id[nr] != 0) // Normal field clicked
        {
            $("#f" + nr).css("background-image", "url('img/b" + fields_id[nr] + ".png')");
            $("#f" + nr).css("opacity", "0.99");
            $("#f" + nr).css("filter", "brightness(100%)");
            hidden--;
        }
        else // Blank field clicked 
        {
            var neighbours;

            if ((nr + 1) % enter == 1) // First column
            {
                neighbours = [nr - enter, nr - enter + 1, nr, nr + 1, nr + enter, nr + enter + 1];
                neighbours = revealBlank(neighbours);

                show_neighbours(neighbours);
            }
            else if ((nr + 1) % enter == 0) // Last column
            {
                neighbours = [nr - enter - 1, nr - enter, nr - 1, nr, nr + enter - 1, nr + enter];
                neighbours = revealBlank(neighbours);

                show_neighbours(neighbours);
            }
            else // Other fields
            {
                neighbours = [nr - enter - 1, nr - enter, nr - enter + 1, nr - 1, nr, nr + 1, nr + enter - 1, nr + enter, nr + enter + 1];
                neighbours = revealBlank(neighbours);

                show_neighbours(neighbours);
            }
        }

        if (hidden == 0)
        {
            stopTimer();
            play = false;
            document.getElementById("flags").innerHTML = "Wygrana!!! <br><span class='reset' onclick='location.reload()'>Jeszcze raz?</span>";
        }
    }
}

function revealBlank(somsiedzi)
{
    var neighbours = somsiedzi;

    for (i = 0; i < neighbours.length; i++)
    {
        if (0 <= neighbours[i] < range)
        {
            let second_neighbours;
            if ((neighbours[i] + 1) % enter == 1) // First column
            {
                let place = fields_id[neighbours[i]];
                if (place == 0)
                {
                    let pole = neighbours[i];
                    second_neighbours = [pole - enter, pole - enter + 1, pole + 1, pole + enter, pole + enter + 1];
                    for (j = 0; j < second_neighbours.length; j++)
                    {
                        if (!neighbours.includes(second_neighbours[j]))
                        {
                            neighbours.push(second_neighbours[j]);
                        }
                    }
                }
            }   
            else if ((neighbours[i] + 1) % enter == 0) // Last column
            {
                let place = fields_id[neighbours[i]];
                if (place == 0)
                {
                    let pole = neighbours[i];
                    second_neighbours = [pole - enter - 1, pole - enter, pole - 1, pole + enter - 1, pole + enter];
                    for (j = 0; j < second_neighbours.length; j++)
                    {
                        if (!neighbours.includes(second_neighbours[j]))
                        {
                            neighbours.push(second_neighbours[j]);
                        }
                    }
                }
            }
            else // Other fields
            {
                let place = fields_id[neighbours[i]];
                if (place == 0)
                {
                    let pole = neighbours[i];
                    second_neighbours = [pole - enter - 1, pole - enter, pole - enter + 1, pole - 1, pole + 1, pole + enter - 1, pole + enter, pole + enter + 1];
                    for (j = 0; j < second_neighbours.length; j++)
                    {
                        if (!neighbours.includes(second_neighbours[j]))
                        {
                            neighbours.push(second_neighbours[j]);
                        }
                    }
                }
            }
        }        
    }
    return neighbours;
}


function show_neighbours(neighbours)
{

    for (i = 0; i < neighbours.length; i++)
    {
        let place_id = neighbours[i];
        if (0 <= neighbours[i] < range)
        {
            if ($("#f" + place_id).css("opacity") == 1)
            {
                $("#f" + place_id).css("background-image", "url('img/b" + fields_id[place_id] + ".png')");
                $("#f" + place_id).css("opacity", "0.99");
                $("#f" + place_id).css("filter", "brightness(100%)");
                hidden--;
            }            
        }
    }
}