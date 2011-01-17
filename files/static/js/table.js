/**
 * @author Tomasz Primke
 */

/**
 * Constructor for the STable class.
 * 
 * The data objects should contain the following properties:
 *   * rows - the number of rows in the table
 *   * cols - the number of cols in the table
 *   * id - the id of the html element-container for the table
 * 
 * Optionally, the following properties can be also given:
 *   * headers - the array of headers for the table
 *   * edit - the id of the cell edit html element [optional]
 * 
 * In the table, only integer values can be stored.
 * 
 * @param {Object} data
 */
function STable( data )
{
  var table = new Object();
	
  table.rows = data.rows;
  table.cols = data.cols;
	
	table.edit = data.edit;
	
	/*
	 * The identifier of the HTML element, that contains the table.
	 */
  table.id = data.id;
	
	/*
	 * The array of table headers.
	 */
  table.hdrs = data.headers;

  /*
   * The table data.
   */
  table.data = new Array( table.rows )
	for ( var i = 0; i < table.rows; i++ )
	  table.data[i] = new Array( table.cols );
	
	/*
	 * The jQuery id of the table containter HTML element.
	 */
  table.jqid = '#' + table.id;
	
  /**
   * Renders the table (puts the table HTML into the table HTML container
   * element).
   * 
   * @alias STable.render
   */
  table.render = function()
  {
		// render the table
    var str_arr = new Array();
    //str_arr.push( '<table width="100%" border="1">' );
		str_arr.push( '<table border="1">' );
    if ( this.hdrs != null )
    {
      str_arr.push( '<tr>' );
      for ( var i in this.hdrs )
      {
				var hdr = this.hdrs[i];
				var txt = hdr;
				var arr = hdr.split('_');
				if (arr.length > 1)
				{
					var h1 = arr[0];
					var h2 = arr[1];
					txt = h1 + '<sub>' + h2 + '</sub>';
				}
        str_arr.push( '<th>' + txt + '</th>' );
      }
      str_arr.push( '</tr>' );
    }
    for (var x = 0; x < this.rows; x++ )
    {
      str_arr.push( '<tr>');
      for ( var y = 0; y < this.cols; y++ )
      {
				var cell_id = this.getCellId(x,y);
        str_arr.push( '<td align="center" id="' + cell_id + '">' + this.data[x][y] + '</td>' );
      }
      str_arr.push( '</tr>');
    }
    str_arr.push( '</table>' );
    $(this.jqid).html( str_arr.join( "\n" ) );
		
		// set up the edit cells code
		if (this.edit != null)
		{
			var table_obj = this;
			var edit_id = '#' + this.edit;
	    for (var x = 0; x < this.rows; x++ )
	    {
	      for ( var y = 0; y < this.cols; y++ )
	      {
	        var cell_id = this.getCellId(x,y);
	        $('#' + cell_id).click( _getEditFunc(table_obj,x,y) );
	      }
	    }
		}
  }

  /**
   * Fills the table with random (integer) numbers, from the optional range.
   * 
   * @param {Object} mn   The minimal value.
   * @param {Object} mx   The maximal value.
   * @alias STable.randomize
   */
  table.randomize = function( mn, mx )
  {
    if (mn == null) mn = 1;
    if (mx == null) mx = 10;
    var range = mx - mn + 1;

    for (var x = 0; x < this.rows; x++ )
    {
      for ( var y = 0; y < this.cols; y++ )
      {
        this.data[x][y] = Math.floor(Math.random()*range) + mn;
        this.setCell(x,y);
      }
    }
  }

  /*
   * Returns the HTML identifier for the given cell.
   */
  table.getCellId = function( row, col )
  {
    return this.id + "_" + row + "_" + col;
  }

  /**
   * Sets the given cell value.
   * 
   * @param {int} row   The row number.
   * @param {int} col   The column number.
   * @param {int/String} val  The value to set. If not given, a value from the
   *                          data array will be used.
   */
  table.setCell = function( row, col, val )
  {
    if ( val == null )
		  val = this.data[row][col];
	  else
		{
			if (typeof(val) == 'string')
			  val = parseInt(val);
			this.data[row][col] = val;
		}
    $('#' + this.getCellId(row,col)).html(val + "");
  }
	
	/**
	 * Returns the value of the given cell.
	 * 
	 * @param {int} row  The row number.
	 * @param {int} col  The column number.
	 */
	table.getCell = function( row, col )
	{
		return this.data[row][col];
	}
	
	/**
	 * Sets the table cells to the values in the given array.
	 * 
	 * Examples:
	 *   _setArray( row1, col1, row2, col2, arr ) - set a part of the table
	 *   _setArray( row1, col1, row2, null, arr ) - set only cells in the column col1
	 * 
	 * @param {int} row1   The number of the base cell row.
	 * @param {int} col1   The number of the base cell column.
	 * @param {int} row2   (Optional) The number of the second row.
	 * @param {int} col2   (Optional) The number of the second column.
	 * @param {Array} arr  The array with data.
	 */
	table._setArray = function( row1, col1, row2, col2, arr )
	{
		if ( row2 == null )
		  row2 = row1;
    if ( col2 == null )
      col2 = col1;
		
		for ( var row = row1; row <= row2; row++ )
		  for ( var col = col1; col <= col2; col++ )
				this.setCell( row, col, arr[row-row1][col-col1])
	}

  /**
   * Returns the array filled with values from the table cells.
   * 
   * @param {int} row1   The number of the base cell row.
   * @param {int} col1   The number of the base cell column.
   * @param {int} row2   (Optional) The number of the second row.
   * @param {int} col2   (Optional) The number of the second column.
   * @param {Array} arr  (Optional) The array object to use.
   */	
	table._getArray = function( row1, col1, row2, col2, arr )
  {
    if ( row2 == null )
      row2 = row1;
    if ( col2 == null )
      col2 = col1;
		var n_rows = row2 - row1 + 1,
		    n_cols = col2 - col1 + 1;
		if ( arr == null )
	  {
			arr = new Array(n_rows);
			for ( var i = 0; i < n_rows; i++ )
			  arr[i] = new Array(n_cols);
		}
		
    for ( var row = row1; row <= row2; row++ )
      for ( var col = col1; col <= col2; col++ )
				arr[row-row1][col-col1] = this.getCell( row, col );
		
		return arr;
  }
	
	/**
	 * Sets the table data to those taken from the given array.
	 * 
	 * If the first argument is the only one given, it's the array to use.
	 * 
	 * @param {int/Array} row1   The top-left row number.
	 * @param {int} col1         The top-left column number.
	 * @param {int} row2         The bottom-right row number.
	 * @param {int} col2         The bottom-right column number.
	 * @param {Array} arr        The data array.
	 */
	table.setArray = function( row1, col1, row2, col2, arr )
	{
		if ( (col1 == null) && (row2 == null) && (col2 == null) && (arr == null) )
		{
      arr = row1;
			row1 = col1 = 0;
			row2 = this.rows-1;
			col2 = this.cols-1;
		}
		this._setArray( row1, col1, row2, col2, arr );
	}

  /**
   * Sets the given row in the table to the data taken from the given array.
   * 
   * @param {int} row  The table row to set
   * @param {Array} arr  The data array.
   */	
	table.setRow = function( row, arr )
	{
		this._setArray( row, 0, row, this.cols-1, arr );
	}

  /**
   * Sets the given rows in the table to the data taken from the given array.
   * 
   * @param {int} row1   The top row number.
   * @param {int} row2   The bottom row number.
   * @param {Array} arr    The data array.
   */
  table.setRows = function( row1, row2, arr )
  {
    this._setArray( row1, 0, row2, this.cols-1, arr );
  }
	
	/**
	 * Sets the given column in the table to the data taken from the given array.
	 * 
	 * @param {int} col   The column number.
	 * @param {Array} arr   The data array.
	 */
	table.setCol = function( col, arr )
	{
		this._setArray( 0, col, this.rows-1, col, arr );
	}

  /**
   * Sets the given columns in the table to the data taken from the given array.
   * 
   * @param {int} col1   The left column number.
   * @param {int} col2   The right column number.
   * @param {Array} arr    The data array.
   */
  table.setCols = function( col1, col2, arr )
  {
    this._setArray( 0, col1, this.rows-1, col2, arr );
  }

  /**
   * Returns array filled with data from the table.
   * 
   * If the first argument is the only one given, it's treated as the array,
   * which should be filled with data from the WHOLE table.
   * 
   * @param {int/Array} row1  The top-left row number, or the array to use.
   * @param {int} col1        The top-left column number.
   * @param {int} row2        The bottom-right row number.
   * @param {int} col2        The bottom-right column number.
   * @param {Array} arr       The data array to use. [optional]
   */
  table.getArray = function( row1, col1, row2, col2, arr )
  {
    if ( (col1 == null) && (row2 == null) && (col2 == null) && (arr == null) )
    {
			if ( row1 != null )
			  arr = row1;
      row1 = col1 = 0;
      row2 = this.rows-1;
      col2 = this.cols-1;
    }
    return this._getArray( row1, col1, row2, col2, arr );
  }

  /**
   * Returns the array filled with data from the given row in the table.
   * 
   * @param {int} row   The row number.
   * @param {Array} arr The data array to use [optional].
   */	
	table.getRow = function( row, arr )
	{
		return this._getArray( row, 0, row, this.cols-1, arr );
	}
	
  table.getRows = function( row1, row2, arr )
  {
    return this._getArray( row1, 0, row2, this.cols-1, arr );
  }
	
	table.getCol = function( col, arr )
	{
		return this._getArray( 0, col, this.rows-1, col, arr );
	}

  table.getCols = function( col1, col2, arr )
  {
    return this._getArray( 0, col1, this.rows-1, col2, arr );
  }
	
	table._hlCell = function( row1, col1, row2, col2, hl, clr )
	{
    if ( hl == null )
      hl = false;
    if ( clr != null )
      if ( clr.charAt(0) != '#' )
        clr = '#' + clr;

    var id = '#' + this.getCellId(row1,col1);

    var selectors = id;
    if ( col2 != null )
    {
      selectors = [];
      for ( var c = col1; c <= col2; c++ )
        selectors.push( '#' + this.getCellId(row1,c));
      id = selectors.join();
    }
    else if ( row2 != null )
    {
      selectors = [];
      for ( var r = row1; r <= row2; r++ )
        selectors.push( '#' + this.getCellId(r,col1));
      id = selectors.join();
    }
		
    if (hl)
    {
			$(id).attr( 'bgcolor', clr);
    }
    else
    {
      $(id).removeAttr( 'bgcolor' );
    }
		
	}
	
	/**
	 * Turns the highlighting for the given cell on or off.
	 * 
	 * @param {int} x  The row number.
	 * @param {int} y  The column number.
	 * @param {bool} hl  Should the highlight be turned on? (default: false)
	 * @param {string} clr   The highlight colour.
	 */
	table.hlCell = function( x, y, hl, clr )
	{
		this._hlCell( x, y, null, null, hl, clr );
	}

  table.hlCellsRow = function( y, x1, x2, bl, clr )
  {
    this._hlCell( y, x1, null, x2, bl, clr );
  }
  
  table.hlCellsCol = function( col, row1, row2, bl, clr )
  {
    this._hlCell( row1, col, row2, null, bl, clr );
  }
  
  table.hlRow = function( row, bl, clr )
  {
    this._hlCell( row, 0, null, this.cols-1, bl, clr );
  }
  
  table.hlCol = function( col, bl, clr )
  {
    this._hlCell( 0, col, this.rows, null, bl, clr );
  }
	
  table._blinkCell = function( row1, col1, row2, col2, bl, clr, timeOn, timeOff )
  {
    if ( bl == null )
      bl = false;
    if ( clr != null )
      if ( clr.charAt(0) != '#' )
        clr = '#' + clr;
    if ( timeOn == null )
      timeOn = 1000;
    if ( timeOff == null )
      timeOff = 300;
		
    
    var id = '#' + this.getCellId(row1,col1);

		if (_blink_data.hasOwnProperty(id) && bl)
		  return;

    if ((!_blink_data.hasOwnProperty(id)) && (!bl))
      return;
		
		var selectors = null;
		var bg_attrs = null;
		if ( col2 != null )
		{
	    selectors = [];
	    for ( var c = col1; c <= col2; c++ )
	      selectors.push( '#' + this.getCellId(row1,c));
		}
		else if ( row2 != null )
		{
      selectors = [];
      for ( var r = row1; r <= row2; r++ )
        selectors.push( '#' + this.getCellId(r,col1));
		}
		
		if ( selectors == null )
		{
			selectors = [ '#' + this.getCellId(row1,col1) ];
		}
		
		if ( selectors != null )
		{
      bg_attrs = {};
      for ( var i in selectors )
      {
        var id_cell = selectors[i];
        var bg = $(id_cell).attr('bgcolor');
        if ( bg === undefined )
          continue;
        bg_attrs[id_cell] = bg;
      }
      selectors = selectors.join();
		}
    
    if (bl)
    {
      _blink_data[id] = {
        next_state: 0,
        colour: clr,
        time_on: timeOn,
        time_off: timeOff,
      };
			if ( selectors != null )
			{
				_blink_data[id].selectors = selectors;
				_blink_data[id].bg = bg_attrs;
				$(selectors).attr('bgcolor', clr);
			}
			else
			{
	      $(id).attr('bgcolor', clr);
			}
      setTimeout('_blink("'+id+'");',timeOn);
    }
    else
    {
      if (_blink_data.hasOwnProperty(id))
      {
				if ( _blink_data[id].hasOwnProperty('selectors'))
				{
					var selectors = _blink_data[id].selectors;
					$(selectors).removeAttr('bgcolor');
					var bg_attrs = _blink_data[id].bg;
					for ( var i in bg_attrs )
					{
						$(i).attr('bgcolor', bg_attrs[i]);
					}
				}
				else
				{
          $(id).removeAttr('bgcolor');
				}
        delete _blink_data[id];
      }
    }
  }
	
	
	/**
	 * Turns blinking of the given cell on or off.
	 * 
	 * @param {int} x  The row number.
	 * @param {int} y  The col number.
	 * @param {bool} bl  Should the cell be blinking or not? (default: false)
	 * @param {string} clr   The colour of blinking.
	 * @param {int} timeOn   The time that the blinking colour should be set. (default: 1000)
	 * @param {int} timeOff  The time that the normal colour should be set. (default: 200)
	 */
	table.blinkCell = function( x, y, bl, clr, timeOn, timeOff )
	{
		this._blinkCell( x, y, null, null, bl, clr, timeOn, timeOff );
	}
	
	table.blinkCellsRow = function( y, x1, x2, bl, clr, timeOn, timeOff )
	{
		this._blinkCell( y, x1, null, x2, bl, clr, timeOn, timeOff );
	}
	
	table.blinkCellsCol = function( col, row1, row2, bl, clr, time_on, time_off )
	{
		this._blinkCell( row1, col, row2, null, bl, clr, time_on, time_off );
	}
	
	table.blinkRow = function( row, bl, clr, time_on, time_off )
	{
		this._blinkCell( row, 0, null, this.cols-1, bl, clr, time_on, time_off );
	}
	
	table.blinkCol = function( col, bl, clr, time_on, time_off )
	{
		this._blinkCell( 0, col, this.rows, null, bl, clr, time_on, time_off );
	}
	
	table.exchCells = function( row1, col1, row2, col2 )
	{
		var id1 = '#' + this.getCellId( row1, col1 ),
		    id2 = '#' + this.getCellId( row2, col2 ),
				tmp = this.data[row1][col1];
		
		this.data[row1][col1] = this.data[row2][col2];
		this.data[row2][col2] = tmp;
		$(id1).html( '' + this.data[row1][col1]);
		$(id2).html( '' + tmp );
	}
	
	table.exchCellsInRow = function( row1, col1, col2, row2 )
	{
		var arr1 = this._getArray( row1, col1, row1, col2 ),
		    arr2 = this._getArray( row2, col1, row2, col2 );
		this._setArray( row1, col1, row1, col2, arr2 );
		this._setArray( row2, col1, row2, col2, arr1 );
	}

  table.exchCellsInCol = function( row1, col1, row2, col2 )
  {
    var arr1 = this._getArray( row1, col1, row2, col1 ),
        arr2 = this._getArray( row1, col2, row2, col2 );
    this._setArray( row1, col1, row2, col1, arr2 );
    this._setArray( row1, col2, row2, col2, arr1 );
  }
	
	table.exchRows = function( row1, row2 )
	{
		var arr1 = this._getArray( row1, 0, row1, this.cols-1 ),
		    arr2 = this._getArray( row2, 0, row2, this.cols-1 );
		this._setArray( row1, 0, row1, this.cols-1, arr2 );
		this._setArray( row2, 0, row2, this.cols-1, arr1 );
	}
	
  table.exchCols = function( col1, col2 )
  {
    var arr1 = this._getArray( 0, col1, this.rows-1, col1 ),
        arr2 = this._getArray( 0, col2, this.rows-1, col2 );
    this._setArray( 0, col1, this.rows-1, col1, arr2 );
    this._setArray( 0, col2, this.rows-1, col2, arr1 );
  }
	
	table._qsort = function( arr_val, arr_idx )
	{
    var idx = Math.floor(Math.random()*arr_val.length);
    var pivot = arr_val[idx];
    var arr_lt = new Array(),
        arr_lt_idx = new Array(),
        arr_gt = new Array(),
        arr_gt_idx = new Array();
    for ( var i = 0; i < arr_val.length; i++ )
    {
      if ( i == idx )
        continue;
      
      var val = arr_val[i];
      if ( val < pivot )
      {
        arr_lt.push(val);
        arr_lt_idx.push( arr_idx[i]);
      } 
      else
      {
        arr_gt.push(val);
        arr_gt_idx.push( arr_idx[i]);
      }
    }
    
    if ( arr_lt.length > 1 )
    {
      ans = this._qsort( arr_lt, arr_lt_idx );
      arr_lt = ans.arr;
      arr_lt_idx = ans.idx;
    }
    if ( arr_gt.length > 1 )
    {
      ans = this._qsort( arr_gt, arr_gt_idx );
      arr_gt = ans.arr;
      arr_gt_idx = ans.idx;
    }
    arr_lt.push(pivot);
    arr_lt_idx.push(arr_idx[idx]);
    
    var res = arr_lt.concat(arr_gt),
        res_idx = arr_lt_idx.concat(arr_gt_idx);
    return { arr: res, idx: res_idx };
	}
	
	table.sort = function( row1, col1, row2, col2, mode )
	{
		var arr = this._getArray( row1, col1, row2, col2 );
		var mode_data = mode.split(',');
		var typ = mode_data[0],
		    num = parseInt( mode_data[1] ),
				asc = (mode_data[2] == 'asc');
		
		var n_rows = row2 - row1 + 1,
		    n_cols = col2 - col1 + 1;
		
		var n_count = (typ == 'col') ? n_rows : n_cols;
		var tmp = new Array(n_count);
		var idx_arr = new Array(n_count);
		var v1, v2, w1, w2;
		if (typ == 'col')
		{
      for ( var i = row1; i <= row2; i++ )
      {
        tmp[i-row1] = arr[i][num];
        idx_arr[i-row1] = i;
      }
			v1 = col1;
			v2 = col2;
			w1 = row1;
			w2 = row2;
		}
		else
		{
      for ( var i = col1; i <= col2; i++ )
      {
        tmp[i-col1] = arr[num][i];
        idx_arr[i-col1] = i;
      }
			v1 = row1;
			v2 = row2;
			w1 = col1;
			w2 = col2;
		}
		
		//alert(tmp);
		
    var res = this._qsort( tmp, idx_arr );
		if (! asc)
		{
			res.arr.reverse();
			res.idx.reverse();
		}
		
		for ( var i = v1; i <= v2; i++ )
		{
			if ( i == num )
			{
				for (var j = w1; j <= w2; j++ )
				  if ( typ == 'col' )
					  this.setCell(j,i,res.arr[j]);
					else
					  this.setCell(i,j,res.arr[j]);
        continue;
			}
			
			for ( var j = 0; j < n_count; j++ )
			  if ( typ == 'col' )
				{
					this.setCell( row1+j,i, arr[ row1+res.idx[j] ][i]);
				}
				else
				{
          this.setCell(i, col1+j, arr[i][ col1+res.idx[j]]);
				}
		}
	}
	
	table.index = function( start )
	{
		if ( start == null )
		  start = 1;
		for ( var i = 0; i < this.rows; i++ )
		  this.setCell( i, 0, start+i );
	}
	
	return table;
}

/*
 * The blinking cells object.
 */
_blink_data = {};


function _blink(id)
{
	if (!_blink_data.hasOwnProperty(id))
	  return;
	
	var data = _blink_data[id];
	var code = '_blink("' + id + '");';
	var selector = '';
	var bg_attrs = null;
	if (data.hasOwnProperty('selectors'))
	{
  	selector = data.selectors;
		bg_attrs = data.bg;
  }
	else
	{
		selector = id;
	}

	if ( data.next_state == 0)
	{
		$(selector).removeAttr('bgcolor');
		for ( var i in bg_attrs )
		{
			$(i).attr('bgcolor', bg_attrs[i]);
		}
	}
	else
	{
		$(selector).attr('bgcolor', data.colour );
	}
	
  if (data.next_state == 0)
  {
    data.next_state = 1;
    setTimeout(code,data.time_off);
  }
  else
  {
    data.next_state = 0;
    setTimeout(code,data.time_on);
  }
}

function _getEditFunc( table_obj, x, y )
{
	var cell_id = table_obj.getCellId(x,y);
	var edit_id = '#' + table_obj.edit;
	var edit_text_id = edit_id + '-text';
	var edit_ok_id = edit_id + '-ok';
	return function()
	{
		var cell_val = table_obj.data[x][y];
		$(edit_text_id).attr('value',cell_val);
		$(edit_ok_id).click(
		  function (e)
			{
		    table_obj.setCell( x, y, $(edit_text_id).attr('value') );
		    $(edit_id).data('overlay').close();
				$(edit_ok_id).unbind('click');
		    e.preventDefault();
			}
		);
		$(edit_id).data('overlay').load();
	};
}

